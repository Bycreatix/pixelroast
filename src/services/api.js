// ===========================
// PixelRoast API Service
// ===========================

const API_URL = import.meta.env.VITE_API_URL || 'https://goat1242-pixelroast-app.hf.space';

/**
 * Roast a website
 * @param {string} url - Website URL to roast
 * @param {string} personality - gen_z, boomer, or ramsay
 * @param {string|null} token - Optional auth token for premium users
 */
export const roastWebsite = async (url, personality = 'gen_z', token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/roast`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            url,
            personality,
            is_premium: !!token
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to roast website');
    }

    return response.json();
};

/**
 * Send a chat message to the Clapback Engine
 * @param {string} message - User's message
 * @param {Array} history - Previous messages [{role, content}]
 * @param {Object} roastContext - The original roast data
 * @param {string} personality - Current personality
 */
export const sendChatMessage = async (message, history = [], roastContext = {}, personality = 'gen_z') => {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            history,
            roast_context: roastContext,
            personality
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Chat failed');
    }

    return response.json();
};

/**
 * Check API health status
 */
export const checkHealth = async () => {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
};

export default {
    roastWebsite,
    sendChatMessage,
    checkHealth,
    API_URL
};
