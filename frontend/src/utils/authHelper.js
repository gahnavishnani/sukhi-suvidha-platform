// src/utils/authHelper.js
// Helper functions to manage authentication data

export const saveUserData = (userData) => {
  try {
    // Store individual fields for backward compatibility
    localStorage.setItem('userPhone', userData.phone);
    localStorage.setItem('userPassword', userData.password);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userLocation', userData.location);
    
    // Also store as a single object for easy access
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const clearAuthData = () => {
  try {
    // Only remove authentication flag, keep user data
    localStorage.removeItem('isAuthenticated');
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// New function to get user phone for login comparison
export const getStoredUserPhone = () => {
  return localStorage.getItem('userPhone');
};

// New function to get user password for login comparison
export const getStoredUserPassword = () => {
  return localStorage.getItem('userPassword');
};