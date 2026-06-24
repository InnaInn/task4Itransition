import { config } from "../config.js";
const beURL = config.beURL;

const API_URL = `${beURL}/api`;

const SessionManager = {
    getSessionId() {
        return sessionStorage.getItem('x-session-id');
    },
    setSessionId(sessionId) {
        if (sessionId) {
            sessionStorage.setItem('x-session-id', sessionId);
        }
    },
    clearSession() {
        sessionStorage.removeItem('x-session-id');
        sessionStorage.removeItem('user');
    }
};

async function fetchWithSession(url, options = {}) {
    const sessionId = SessionManager.getSessionId();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (sessionId) {
        headers['x-session-id'] = sessionId;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    const newSessionId = response.headers.get('x-session-id');
    if (newSessionId) {
        SessionManager.setSessionId(newSessionId);
    }
    
    return response;
}

function checkAuthorization(response) {
    if (response.status === 401) {
        SessionManager.clearSession();
        throw {name: 'NotAuthorized', message: 'User is not authorized to perform request'};
    }
}

export const checkServerConnection = async () => {
  try {
    const response = await fetchWithSession(`${API_URL}/health`);
    const data = await response.json();
    console.log('Сервер работает:', data);
    return data;
  } catch (error) {
    console.error('Сервер не отвечает:', error);
    throw error;
  }
};

export const getUsers = async (email, sortField, sortOrder) => {
  try {
    const url = new URL(`${API_URL}/users`);
    if (email) {
        url.searchParams.set('filter[email][ilike]', email);
    }
    url.searchParams.set(`sort[${sortField}]`, sortOrder);
    url.searchParams.set('page[number]', '1');
    url.searchParams.set('page[size]', '100');
    
    const response = await fetchWithSession(url);
    checkAuthorization(response);
    const data = await response.json();
    console.log('Пользователи из БД:', data);
    return data.data || [];
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetchWithSession(`${API_URL}/users/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Invalid credentials');
        }
        
        const data = await response.json();
        
        if (data.user) {
            sessionStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await fetchWithSession(`${API_URL}/users/logout`, {
            method: 'POST'
        });
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        SessionManager.clearSession();
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await fetchWithSession(`${API_URL}/users/${userId}`, {
            method: 'DELETE'
        });
        checkAuthorization(response);
        return await response.json();
    } catch (error) {
        console.error('Ошибка удаления:', error);
        throw error;
    }
};


export const updateUserStatus = async (userId, status) => {
    try {
        const response = await fetchWithSession(`${API_URL}/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
        checkAuthorization(response);
        return await response.json();
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        throw error;
    }
};