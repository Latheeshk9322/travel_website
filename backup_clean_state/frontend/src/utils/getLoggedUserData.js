// Utility to get the currently logged-in user's data from localStorage

export function getLoggedUserData() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (err) {
    console.error('Error parsing user data from localStorage:', err);
    return null;
  }
}

// Usage example:
// import { getLoggedUserData } from '../utils/getLoggedUserData';
// const user = getLoggedUserData();
// if (user) { console.log(user); } 