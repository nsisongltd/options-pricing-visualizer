const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
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
  getUserPreferences: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-preferences/${userId}`);
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
  saveUserPreferences: async (userId, preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-preferences/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
}; 