const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth endpoints
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Get historical options data
  getHistoricalData: async (symbol, startDate, endDate) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/historical-data?symbol=${symbol}&startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  // Get user preferences
  getUserPreferences: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/preferences`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  },

  // Save user preferences
  saveUserPreferences: async (preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) {
        throw new Error('Failed to save user preferences');
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  },

  // Save calculation
  saveCalculation: async (calculation) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calculations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(calculation),
      });
      if (!response.ok) {
        throw new Error('Failed to save calculation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error saving calculation:', error);
      throw error;
    }
  },

  // Get user calculations
  getUserCalculations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/calculations`, {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calculations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching calculations:', error);
      throw error;
    }
  },
}; 