const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // My Auth endpoints
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
  async getHistoricalData(symbol, startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/historical-data`, {
        params: {
          symbol,
          startDate,
          endDate
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from server');
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        throw new Error(error.response.data.message || 'Failed to fetch historical data');
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else went wrong
        throw new Error('An error occurred while fetching historical data');
      }
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