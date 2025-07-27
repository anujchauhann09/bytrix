import Cookies from 'js-cookie';
import config from './config';

const getAuthHeaders = () => {
  const accessToken = Cookies.get('access');  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
};

export async function apiRequest(endpoint, options = {}) {
  const url = `${config.API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body instanceof FormData) {
    delete defaultOptions.headers['Content-Type'];
  }

  const configuration = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, configuration);
    
    if (response.status >= 200 && response.status < 300) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return { success: true, status: response.status };
      }
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  login: (email, password) => 
    apiRequest('signin/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signup: (email, password) => 
    apiRequest('signup/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  logout: () => {
    const refreshToken = Cookies.get('refresh');
    return apiRequest('logout/', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  getProfile: () => 
    apiRequest('users/', {
      method: 'GET',
      headers: getAuthHeaders(),
    }),

  updateProfile: (data) => 
    apiRequest('users/', {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),

  deleteAccount: () => 
    apiRequest('users/', {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }),

  convertFile: (file, outputFormat) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('output_format', outputFormat);
    
    return apiRequest('conversion/', {
      method: 'POST',
      headers: {
        ...(getAuthHeaders().Authorization && { Authorization: getAuthHeaders().Authorization }),
      },
      body: formData,
    });
  },

  compressFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('compress/', {
      method: 'POST',
      headers: {
        ...(getAuthHeaders().Authorization && { Authorization: getAuthHeaders().Authorization }),
      },
      body: formData,
    });
  },

  summarizeFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('ai/summarize/', {
      method: 'POST',
      headers: {
        ...(getAuthHeaders().Authorization && { Authorization: getAuthHeaders().Authorization }),
      },
      body: formData,
    });
  },
}; 