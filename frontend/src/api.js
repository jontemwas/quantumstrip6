import axios from 'axios';

// Get backend URL from environment variables
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quantumstrip_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('quantumstrip_token');
      localStorage.removeItem('quantumstrip_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
  
  logout: async () => {
    localStorage.removeItem('quantumstrip_token');
    localStorage.removeItem('quantumstrip_user');
  }
};

// Token System API
export const tokenAPI = {
  getPackages: async () => {
    const response = await api.get('/tokens/packages');
    return response.data;
  },
  
  purchaseTokens: async (purchaseData) => {
    const response = await api.post('/tokens/purchase', purchaseData);
    return response.data;
  },
  
  getBalance: async () => {
    const response = await api.get('/tokens/balance');
    return response.data;
  },
  
  getTransactions: async (limit = 20, offset = 0) => {
    const response = await api.get(`/tokens/transactions?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  
  checkPaymentStatus: async (checkoutRequestId) => {
    const response = await api.get(`/tokens/mpesa/status/${checkoutRequestId}`);
    return response.data;
  }
};

// Model System API
export const modelAPI = {
  sendTip: async (tipData) => {
    const response = await api.post('/models/tip', tipData);
    return response.data;
  },
  
  getEarnings: async () => {
    const response = await api.get('/models/earnings');
    return response.data;
  },
  
  requestWithdrawal: async (withdrawalData) => {
    const response = await api.post('/models/withdraw', withdrawalData);
    return response.data;
  },
  
  getWithdrawals: async (limit = 20, offset = 0) => {
    const response = await api.get(`/models/withdrawals?limit=${limit}&offset=${offset}`);
    return response.data;
  }
};

// Streaming API
export const streamingAPI = {
  createSession: async (sessionData) => {
    const response = await api.post('/streaming/session', sessionData);
    return response.data;
  },
  
  endSession: async (sessionId) => {
    const response = await api.delete(`/streaming/session/${sessionId}`);
    return response.data;
  },
  
  requestPrivateShow: async (showData) => {
    const response = await api.post('/streaming/private-show', showData);
    return response.data;
  },
  
  acceptPrivateShow: async (showId) => {
    const response = await api.patch(`/streaming/private-show/${showId}/accept`);
    return response.data;
  },
  
  endPrivateShow: async (showId) => {
    const response = await api.patch(`/streaming/private-show/${showId}/end`);
    return response.data;
  },
  
  getLiveModels: async () => {
    const response = await api.get('/streaming/models/live');
    return response.data;
  },
  
  updateModelStatus: async (statusData) => {
    const response = await api.patch('/streaming/models/status', statusData);
    return response.data;
  },
  
  sendWebRTCSignal: async (signalData) => {
    const response = await api.post('/streaming/webrtc/signal', signalData);
    return response.data;
  },
  
  getWebRTCSignals: async (sessionId) => {
    const response = await api.get(`/streaming/webrtc/signals/${sessionId}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },
  
  createOrUpdateSetting: async (settingData) => {
    const response = await api.post('/admin/settings', settingData);
    return response.data;
  },
  
  deleteSetting: async (settingKey) => {
    const response = await api.delete(`/admin/settings/${settingKey}`);
    return response.data;
  },
  
  getPlatformStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getAllUsers: async (role = null, limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },
  
  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },
  
  getAllWithdrawals: async (statusFilter = null, limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status_filter', statusFilter);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await api.get(`/admin/withdrawals?${params.toString()}`);
    return response.data;
  },
  
  processWithdrawal: async (withdrawalId, action, data) => {
    const response = await api.patch(`/admin/withdrawals/${withdrawalId}`, {
      action,
      ...data
    });
    return response.data;
  }
};

// Chat System API
export const chatAPI = {
  getChatRooms: async () => {
    const response = await api.get('/chat/rooms');
    return response.data;
  },
  
  getChatHistory: async (roomId, limit = 50, before = null) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before) params.append('before', before);
    
    const response = await api.get(`/chat/rooms/${roomId}/messages?${params.toString()}`);
    return response.data;
  },
  
  getRoomUsers: async (roomId) => {
    const response = await api.get(`/chat/rooms/${roomId}/users`);
    return response.data;
  },
  
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  },
  
  // WebSocket connection helper
  createWebSocketConnection: (roomId, onMessage, onError) => {
    const token = localStorage.getItem('quantumstrip_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/chat/${roomId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`Connected to chat room: ${roomId}`);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };
    
    ws.onclose = (event) => {
      console.log(`Disconnected from chat room: ${roomId}`, event.code, event.reason);
    };
    
    return ws;
  }
};

// Utility functions
export const apiUtils = {
  handleApiError: (error) => {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  formatTokenAmount: (tokens) => {
    return new Intl.NumberFormat().format(tokens);
  },
  
  formatCurrency: (amount, currency = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency === 'KES' ? 'KES' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },
  
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default api;