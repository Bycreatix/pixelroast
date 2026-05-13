# 🔥 PixelRoast

> **A High-Performance Ego Destruction Engine**

Submit your portfolio or website. Our AI will roast it with the brutal honesty your friends are too nice to give you.

![PixelRoast Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-19.2-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

## 🎯 Features

- **🌐 Website Roaster** - AI analyzes your site's UI/UX and roasts it with Tailwind CSS fixes
- **🎭 Personality Engine** - Choose your roaster: Gen Z Intern, Boomer Boss, or Gordon Ramsay
- **💬 Clapback Chat** - Argue with the AI (you'll lose)
- **📄 Resume Reality Check** - Compare your "Expert" skills against reality *(coming soon)*
- **⚡ Powered by Groq** - Lightning-fast inference with Llama 4 Vision

## 🏗️ Tech Stack

### Frontend
- **React 19** + Vite
- **Tailwind CSS v4** - Neo-brutalist design
- **Framer Motion** - Animations
- **Lucide Icons**

### Backend
- **FastAPI** - High-performance Python API
- **Playwright** - Headless browser for screenshots
- **Groq API** - Llama 4 Vision for AI analysis
- **Upstash Redis** - Rate limiting & caching
- **Supabase** - Auth & database
## 🔒 Security

- ✅ CORS whitelist (no wildcard)
- ✅ SSRF protection (blocks internal IPs)
- ✅ XSS sanitization with Bleach
- ✅ Rate limiting (Redis-based)
- ✅ JWT authentication (Supabase)

## 📁 Project Structure

```
pixelroast/
├── src/
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature components (Hero, Chat, etc.)
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   └── utils/          # Utility functions
├── app.py              # FastAPI backend
├── Dockerfile          # HF Spaces deployment
└── requirements.txt    # Python dependencies
```

## 🎨 Design System

Neo-brutalist design with:
- **Colors**: Black (#050505), Red (#FF0033), Yellow (#FFD60A)
- **Typography**: Inter Tight, JetBrains Mono
- **Shadows**: Hard offset shadows
- **Borders**: Thick black borders

## 📄 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message |
| `/health` | GET | Health check |
| `/roast` | POST | Roast a website |
| `/chat` | POST | Clapback chat |
| `/analyze-resume` | POST | Resume analysis *(coming soon)* |

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

All rights reserved.

---

**Made with 🖤, ☕, and pure anxiety**

*PixelRoast is a High-Performance Ego Destruction Engine. Powered by Llama 4 Vision & Groq. Frontend by React. Trauma by Design.*
