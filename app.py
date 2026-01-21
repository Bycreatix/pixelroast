import os
import hashlib
import json
import io
import base64
import time
import re
from datetime import date
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, field_validator
from playwright.async_api import async_playwright
from PIL import Image
from groq import Groq
import redis
import bleach
from supabase import create_client, Client

# ===========================
# CONFIGURATION & CLIENTS
# ===========================

# Redis prefix for shared database (IMPORTANT: unique to PixelRoast)
REDIS_PREFIX = "pixelroast:v1:"

# Optional Redis setup for caching & rate limiting
redis_error = None
redis_client = None
try:
    redis_url = os.getenv("UPSTASH_REDIS_REST_URL")
    redis_token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
    if redis_url and redis_token:
        if redis_url.startswith("https://"):
            redis_client = redis.StrictRedis.from_url(
                redis_url.replace("https://", "rediss://"), 
                password=redis_token, 
                decode_responses=True
            )
        else:
            redis_client = redis.StrictRedis.from_url(
                redis_url, 
                password=redis_token, 
                decode_responses=True
            )
        redis_client.ping()
    else:
        redis_error = "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing"
except Exception as e:
    redis_client = None
    redis_error = str(e)

# Supabase setup for auth & database
supabase_client: Optional[Client] = None
supabase_error = None
try:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    if supabase_url and supabase_key:
        supabase_client = create_client(supabase_url, supabase_key)
    else:
        supabase_error = "SUPABASE_URL or SUPABASE_ANON_KEY missing"
except Exception as e:
    supabase_error = str(e)

# Groq client for AI
groq_client = None
groq_api_key = os.getenv("GROQ_API_KEY")
if groq_api_key:
    groq_client = Groq(api_key=groq_api_key)
else:
    print("⚠️  WARNING: GROQ_API_KEY not found. Add it to Space secrets to enable roasting.")

# ===========================
# FASTAPI APP SETUP
# ===========================
app = FastAPI(title="PixelRoast API", version="1.1")
security = HTTPBearer(auto_error=False)

# CORS Configuration - Strict whitelist for security
ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", ""),
    "https://pixelroast.pages.dev",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]
ALLOWED_ORIGINS = [o for o in ALLOWED_ORIGINS if o]  # Remove empty strings

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS else ["*"],  # Fallback only if no origins set
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ===========================
# REQUEST MODELS
# ===========================
# URL validation patterns to block SSRF attacks
BLOCKED_URL_PATTERNS = [
    r'^https?://localhost',
    r'^https?://127\.',
    r'^https?://10\.',
    r'^https?://192\.168\.',
    r'^https?://172\.(1[6-9]|2[0-9]|3[0-1])\.',
    r'^file://',
    r'^https?://\[',  # IPv6
    r'^https?://0\.',
    r'^https?://169\.254\.',  # Link-local
]

class RoastRequest(BaseModel):
    url: str
    personality: str = "gen_z"  # gen_z, boomer, ramsay
    is_premium: bool = False
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v):
        # Ensure URL starts with http:// or https://
        if not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http:// or https://')
        # Block internal/private IPs (SSRF protection)
        for pattern in BLOCKED_URL_PATTERNS:
            if re.match(pattern, v, re.IGNORECASE):
                raise ValueError('Internal or private URLs are not allowed')
        return v

class ChatRequest(BaseModel):
    message: str
    history: list = []  # Previous messages [{role, content}]
    roast_context: dict = {}  # The original roast JSON
    personality: str = "gen_z"

class ResumeRequest(BaseModel):
    filename: str
    is_premium: bool = False

class ScanStorageRequest(BaseModel):
    url: str
    roast_data: dict
    personality: str = "gen_z"

# ===========================
# AUTH UTILITIES
# ===========================
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    """
    Validates Supabase JWT token and returns user info.
    Returns None if no token provided (anonymous user).
    """
    if not credentials or not supabase_client:
        return None
    
    try:
        token = credentials.credentials
        user_response = supabase_client.auth.get_user(token)
        if user_response and user_response.user:
            return {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "is_premium": user_response.user.user_metadata.get("is_premium", False)
            }
    except Exception:
        pass
    return None

# ===========================
# RATE LIMITING (Redis-based)
# ===========================
def check_rate_limit(ip: str, is_premium: bool, limit: int = 1, window: int = 60) -> tuple:
    """
    Sliding window rate limiter using Redis.
    
    Args:
        ip: Client IP address
        is_premium: Premium users bypass scan rate limits
        limit: Max requests in window
        window: Time window in seconds
    
    Returns:
        (allowed: bool, retry_after_seconds: int)
    """
    if is_premium:
        return True, 0
    
    if not redis_client:
        return True, 0  # Allow if Redis unavailable
    
    try:
        key = f"{REDIS_PREFIX}ratelimit:{ip}"
        now = time.time()
        
        pipe = redis_client.pipeline()
        pipe.zremrangebyscore(key, 0, now - window)
        pipe.zadd(key, {str(now): now})
        pipe.zcard(key)
        pipe.expire(key, window)
        results = pipe.execute()
        count = results[2]
        
        if count > limit:
            oldest = redis_client.zrange(key, 0, 0, withscores=True)
            if oldest:
                retry_after = int(window - (now - oldest[0][1]))
                return False, max(retry_after, 1)
            return False, window
        return True, 0
    except Exception:
        return True, 0  # Allow on Redis error

def check_scan_limit(ip: str, user_id: Optional[str], is_premium: bool) -> tuple:
    """
    Tracks total scans per user/IP.
    
    Limits:
        - Free tier: 5 scans total (lifetime per IP)
        - Premium tier: 50 scans per day
    
    Returns:
        (allowed: bool, used: int, limit: int)
    """
    if not redis_client:
        return True, 0, 999  # Allow if Redis unavailable
    
    try:
        if is_premium:
            identifier = user_id or ip
            key = f"{REDIS_PREFIX}scans:premium:{identifier}:{date.today().isoformat()}"
            limit = 50
            ttl = 86400  # Reset daily
        else:
            key = f"{REDIS_PREFIX}scans:free:{ip}"
            limit = 5
            ttl = None  # Never expires (lifetime limit for free)
        
        current = int(redis_client.get(key) or 0)
        if current >= limit:
            return False, current, limit
        
        redis_client.incr(key)
        if ttl:
            redis_client.expire(key, ttl)
        
        return True, current + 1, limit
    except Exception:
        return True, 0, 999  # Allow on Redis error

def check_chat_rate_limit(ip: str) -> tuple:
    """
    Chat-specific rate limit: 10 requests per 60 seconds.
    
    Returns:
        (allowed: bool, retry_after_seconds: int)
    """
    if not redis_client:
        return True, 0
    
    try:
        key = f"{REDIS_PREFIX}chat:ratelimit:{ip}"
        now = time.time()
        window = 60
        limit = 10
        
        pipe = redis_client.pipeline()
        pipe.zremrangebyscore(key, 0, now - window)
        pipe.zadd(key, {str(now): now})
        pipe.zcard(key)
        pipe.expire(key, window)
        results = pipe.execute()
        count = results[2]
        
        if count > limit:
            return False, window
        return True, 0
    except Exception:
        return True, 0

# ===========================
# MODEL ROUTING
# ===========================
def select_model(is_premium: bool, task: str) -> str:
    """Routes to the correct model based on user tier and task type."""
    if task == "vision":
        return "meta-llama/llama-4-maverick-17b-128e-instruct" if is_premium else "meta-llama/llama-4-scout-17b-16e-instruct"
    elif task == "resume":
        return "moonshotai/kimi-k2-instruct" if is_premium else "llama-3.3-70b-versatile"
    elif task == "chat":
        return "llama-3.1-8b-instant"  # Same for all tiers
    else:
        return "llama-3.1-8b-instant"

# ===========================
# PERSONALITY ENGINE
# ===========================
def get_personality_prompt(personality: str) -> str:
    """Returns the system prompt for the selected roast personality."""
    personalities = {
        "gen_z": """You are "The Gen Z Intern" - a brutally honest junior designer who speaks in Gen Z slang.
        
Rules:
- Use phrases like "no cap", "giving depression", "mid", "cooked", "bestie"
- Roast padding issues: "This padding is giving anxiety, bestie"
- Call out bad typography: "This font is absolutely cooked"
- Be sarcastic but ultimately helpful
- ALWAYS include a 'fix_code' field with valid Tailwind CSS classes for every error
- Format output as JSON with fields: critique (string), errors (array), fixes (array of {issue, fix_code})
""",
        "boomer": """You are "The Boomer Boss" - a corporate executive who speaks in business jargon.
        
Rules:
- Use corporate speak: "Let's circle back", "synergy", "low hanging fruit", "move the needle"
- Complain about "not seeing the vision"
- Reference "the old days" when design was simpler
- Question: "Is this aligned with our KPIs?"
- ALWAYS include a 'fix_code' field with valid Tailwind CSS classes for every error
- Format output as JSON with fields: critique (string), errors (array), fixes (array of {issue, fix_code})
""",
        "ramsay": """You are Gordon Ramsay critiquing web design. BE ABSOLUTELY FURIOUS.
        
Rules:
- USE CAPS LOCK FREQUENTLY
- Use cooking metaphors: "THIS CSS IS RAW!", "WHERE'S THE LAMB SAUCE?", "IT'S FROZEN!"
- Call the designer a "donkey" when appropriate
- Compare bad design to undercooked food
- Be BRUTAL but end with what needs fixing
- ALWAYS include a 'fix_code' field with valid Tailwind CSS classes for every error
- Format output as JSON with fields: critique (string), errors (array), fixes (array of {issue, fix_code})
"""
    }
    return personalities.get(personality, personalities["gen_z"])

def get_chat_personality_prompt(personality: str, roast_context: dict) -> str:
    """Returns chat-specific system prompt with roast context injected."""
    base_prompts = {
        "gen_z": "You are 'The Gen Z Intern'. Use slang like 'no cap', 'bestie', 'cooked'. Be sarcastic but helpful.",
        "boomer": "You are 'The Boomer Boss'. Use corporate jargon like 'synergy', 'circle back'. Be condescending.",
        "ramsay": "You are Gordon Ramsay. USE CAPS. Be FURIOUS. Use cooking metaphors. Call them 'donkey'."
    }
    
    base = base_prompts.get(personality, base_prompts["gen_z"])
    
    # Inject roast context to maintain consistency
    context_summary = ""
    if roast_context:
        url = roast_context.get("url", "Unknown")
        critique = roast_context.get("roast", "")[:300]
        errors = roast_context.get("errors", [])[:3]
        context_summary = f"""

CONTEXT FROM YOUR PREVIOUS ROAST:
- URL analyzed: {url}
- Your critique: {critique}
- Key errors you found: {json.dumps(errors)}

The user is responding to YOUR critique. Stay in character and reference these specific issues when relevant.
Do NOT repeat the full roast. Give short, punchy replies (max 150 words).
"""
    
    return base + context_summary

# ===========================
# IMAGE OPTIMIZATION
# ===========================
def optimize_image(img_bytes: bytes) -> bytes:
    """Reduces image size for faster AI processing and lower token usage."""
    img = Image.open(io.BytesIO(img_bytes))
    
    if img.width > 1280:
        ratio = 1280 / float(img.width)
        height = int(float(img.height) * float(ratio))
        img = img.resize((1280, height), Image.Resampling.LANCZOS)
    
    buffer = io.BytesIO()
    img.convert("RGB").save(buffer, format="JPEG", quality=72, optimize=True)
    return buffer.getvalue()

# ===========================
# CACHE UTILITIES
# ===========================
def cache_key(url: str) -> str:
    """Generates a unique cache key for a URL with project-specific prefix."""
    return f"{REDIS_PREFIX}cache:{hashlib.sha256(url.encode()).hexdigest()}"

def get_cached_roast(url: str) -> Optional[dict]:
    """Retrieves cached roast if available."""
    if not redis_client:
        return None
    try:
        key = cache_key(url)
        cached = redis_client.get(key)
        return json.loads(cached) if cached else None
    except Exception:
        return None

def cache_roast(url: str, result: dict, ttl: int = 86400):
    """Caches roast result for 24 hours."""
    if not redis_client:
        return
    try:
        key = cache_key(url)
        redis_client.setex(key, ttl, json.dumps(result))
    except Exception:
        pass

# ===========================
# XSS SANITIZATION
# ===========================
def sanitize_text(text: str) -> str:
    """Sanitize text to prevent XSS attacks."""
    if not text:
        return ""
    return bleach.clean(text, tags=[], strip=True)

def sanitize_roast_data(data: dict) -> dict:
    """Sanitize all string fields in roast response."""
    if not data:
        return {}
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_text(value)
        elif isinstance(value, list):
            sanitized[key] = [
                sanitize_text(v) if isinstance(v, str) else v 
                for v in value
            ]
        elif isinstance(value, dict):
            sanitized[key] = sanitize_roast_data(value)
        else:
            sanitized[key] = value
    return sanitized

# ===========================
# API ENDPOINTS
# ===========================
@app.get("/")
async def root():
    return {"message": "PixelRoast API v1.1 - Emotional Damage on Demand"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Hugging Face Spaces."""
    return {
        "status": "healthy",
        "redis_connected": redis_client is not None,
        "redis_error": redis_error,
        "supabase_connected": supabase_client is not None,
        "supabase_error": supabase_error,
        "groq_configured": groq_client is not None,
        "message": "Ready to roast!" if groq_client else "Add GROQ_API_KEY to enable AI roasting"
    }

@app.post("/roast")
async def roast_website(
    req: RoastRequest, 
    request: Request,
    user: Optional[dict] = Depends(get_current_user)
):
    """
    Main roast endpoint: Captures website screenshot and returns AI critique.
    
    Rate Limits:
        - Free: 1 request/60 seconds, 5 total scans
        - Premium: No rate limit, 50 scans/day
    """
    ip = request.client.host if request.client else "unknown"
    is_premium = (user and user.get("is_premium", False)) or req.is_premium
    user_id = user.get("id") if user else None
    
    # Rate limit check
    allowed, retry_after = check_rate_limit(ip, is_premium)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Retry after {retry_after} seconds.",
            headers={"Retry-After": str(retry_after)}
        )
    
    # Scan limit check
    scan_allowed, used, limit = check_scan_limit(ip, user_id, is_premium)
    if not scan_allowed:
        raise HTTPException(
            status_code=403,
            detail=f"Scan limit reached ({used}/{limit}). Upgrade to Premium for more scans."
        )
    
    # Check cache first
    cached = get_cached_roast(req.url)
    if cached:
        return {**cached, "cached": True, "scans_used": used, "scans_limit": limit}
    
    # Capture screenshot
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page(viewport={"width": 1920, "height": 1080})
            await page.goto(req.url, wait_until="networkidle", timeout=30000)
            raw_screenshot = await page.screenshot(full_page=True, type="png")
            await browser.close()
            
            optimized_img = optimize_image(raw_screenshot)
            img_base64 = base64.b64encode(optimized_img).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to capture screenshot: {str(e)}")
    
    # AI Analysis
    if not groq_client:
        raise HTTPException(
            status_code=503, 
            detail="AI service not configured. Add GROQ_API_KEY to Space secrets."
        )
    
    model = select_model(is_premium, "vision")
    system_prompt = get_personality_prompt(req.personality)
    
    try:
        response = groq_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this website design. Identify UI/UX issues and provide Tailwind CSS fixes for each problem."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
                    ]
                }
            ],
            temperature=0.8,
            max_tokens=2048,
        )
        
        roast_content = response.choices[0].message.content
        
        try:
            roast_data = json.loads(roast_content)
        except json.JSONDecodeError:
            roast_data = {"critique": roast_content, "errors": [], "fixes": []}
        
        # Sanitize AI output to prevent XSS
        roast_data = sanitize_roast_data(roast_data)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
    
    # Build response
    result = {
        "url": req.url,
        "personality": req.personality,
        "model_used": model,
        "tier": "premium" if is_premium else "free",
        "roast": roast_data.get("critique", ""),
        "errors": roast_data.get("errors", []),
        "fixes": roast_data.get("fixes", []),
        "screenshot_optimized": True,
        "cached": False,
        "scans_used": used,
        "scans_limit": limit
    }
    
    cache_roast(req.url, result)
    return result

@app.post("/chat")
async def chat_clapback(
    req: ChatRequest, 
    request: Request,
    user: Optional[dict] = Depends(get_current_user)
):
    """
    The Clapback Engine: Context-aware chat after a roast.
    
    Features:
        - Uses roast_context to reference specific errors
        - Maintains personality consistency
        - Rate limited: 10 requests/60 seconds
        - Uses llama-3.1-8b-instant for all tiers
    """
    ip = request.client.host if request.client else "unknown"
    
    # Chat rate limit (10 req/60s for everyone)
    allowed, retry_after = check_chat_rate_limit(ip)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Chat rate limit exceeded. Slow down, bestie."
        )
    
    if not groq_client:
        raise HTTPException(
            status_code=503, 
            detail="AI service not configured. Add GROQ_API_KEY to Space secrets."
        )
    
    # Build context-aware system prompt
    system_prompt = get_chat_personality_prompt(req.personality, req.roast_context)
    
    # Build messages array
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add history (limit to last 10 exchanges to save tokens)
    for msg in req.history[-10:]:
        if isinstance(msg, dict) and "role" in msg and "content" in msg:
            messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Add current message
    messages.append({"role": "user", "content": req.message})
    
    try:
        response = groq_client.chat.completions.create(
            model=select_model(False, "chat"),
            messages=messages,
            temperature=0.9,
            max_tokens=512
        )
        
        reply = response.choices[0].message.content
        
        return {
            "reply": reply,
            "personality": req.personality,
            "model_used": "llama-3.1-8b-instant"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

class ScanStorageRequest(BaseModel):
    url: str
    roast_data: dict
    personality: str = "gen_z"

# ===========================
# SCAN HISTORY ENDPOINTS
# ===========================
@app.get("/scans")
async def get_scans(user: dict = Depends(get_current_user)):
    """Fetch user's scan history."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Database not configured")
    
    try:
        response = supabase_client.table("scan_history") \
            .select("*") \
            .eq("user_id", user["id"]) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch scans: {str(e)}")

@app.post("/scans")
async def save_scan(
    scan: ScanStorageRequest, 
    user: dict = Depends(get_current_user)
):
    """Save a roast to history with storage limits."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Database not configured")
    
    # Check current usage
    try:
        # Get count (inefficient but simple for now)
        count_response = supabase_client.table("scan_history") \
            .select("id", count="exact") \
            .eq("user_id", user["id"]) \
            .execute()
        
        current_count = count_response.count
        limit = 30 if user.get("is_premium") else 5
        
        if current_count >= limit:
            raise HTTPException(
                status_code=403, 
                detail="STORAGE_LIMIT_REACHED"
            )
            
        # Save scan
        data = {
            "user_id": user["id"],
            "url": scan.url,
            "roast_data": scan.roast_data,
            "personality": scan.personality
        }
        
        supabase_client.table("scan_history").insert(data).execute()
        return {"status": "saved"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save scan: {str(e)}")

@app.delete("/scans/{scan_id}")
async def delete_scan(
    scan_id: str, 
    user: dict = Depends(get_current_user)
):
    """Delete a specific scan from history."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Database not configured")
    
    try:
        # RLS policies should handle ownership check, but explicit check matches logic
        response = supabase_client.table("scan_history") \
            .delete() \
            .eq("id", scan_id) \
            .eq("user_id", user["id"]) \
            .execute()
            
        if not response.data:
            # Note: Supabase delete returns data only if successful matches found? 
            # Or if select was requested? Assuming RLS handles it.
            pass
            
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete scan: {str(e)}")

@app.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...), 
    is_premium: bool = False,
    request: Request = None,
    user: Optional[dict] = Depends(get_current_user)
):
    """
    Resume analysis endpoint with PII redaction.
    
    NOTE: Full PDF parsing and PII redaction to be implemented.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # TODO: Implement PDF parsing and PII redaction with Presidio
    return {
        "message": "Resume analysis coming soon",
        "filename": file.filename,
        "status": "PII redaction will be implemented with Microsoft Presidio"
    }
