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
 * Save roast to history
 */
export const saveScanHistory = async (scanData, token) => {
    if (!token) return null; // Can't save if not logged in

    const response = await fetch(`${API_URL}/scans`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scanData)
    });

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error('STORAGE_LIMIT_REACHED');
        }
        throw new Error('Failed to save history');
    }
    return response.json();
};

/**
 * Get user's scan history
 */
export const getScanHistory = async () => {
    const session = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
    const token = session.data.session?.access_token;
    if (!token) return [];

    const response = await fetch(`${API_URL}/scans`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
};

/**
 * Delete a scan
 */
export const deleteScan = async (id) => {
    const session = await import('../lib/supabase').then(m => m.supabase.auth.getSession());
    const token = session.data.session?.access_token;
    if (!token) throw new Error('Not logged in');

    const response = await fetch(`${API_URL}/scans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to delete scan');
    return true;
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
    saveScanHistory,
    getScanHistory,
    deleteScan,
    checkHealth,
    API_URL
};
