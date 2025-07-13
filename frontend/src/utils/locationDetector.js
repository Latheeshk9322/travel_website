// Location detection and management utility
export const LOCATIONS = {
  Karnataka: 'Karnataka',
  Maharashtra: 'Maharashtra',
  TamilNadu: 'TamilNadu',
  Kerala: 'Kerala',
  Delhi: 'Delhi',
  Rajasthan: 'Rajasthan',
  UttarPradesh: 'UttarPradesh',
  Gujarat: 'Gujarat',
  WestBengal: 'WestBengal',
  Goa: 'Goa',
  Uttarakhand: 'Uttarakhand',
  default: 'default'
};

// Get user location from localStorage or default to Karnataka
export const getUserLocation = () => {
  return localStorage.getItem('userLocation') || 'Karnataka';
};

// Set user location in localStorage
export const setUserLocation = (location) => {
  if (LOCATIONS[location]) {
    localStorage.setItem('userLocation', location);
    return true;
  }
  return false;
};

// Detect location based on IP (simplified - in real app, you'd use a geolocation service)
export const detectLocation = async () => {
  try {
    // For demo purposes, we'll use a simple approach
    // In a real application, you'd use a service like ipapi.co or similar
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Map country/region to our location constants
    const locationMap = {
      'IN-KA': 'Karnataka',
      'IN-MH': 'Maharashtra',
      'IN-TN': 'TamilNadu',
      'IN-KL': 'Kerala',
      'IN-DL': 'Delhi',
      'IN-RJ': 'Rajasthan',
      'IN-UP': 'UttarPradesh',
      'IN-GJ': 'Gujarat',
      'IN-WB': 'WestBengal',
      'IN-GA': 'Goa',
      'IN-UT': 'Uttarakhand'
    };
    
    const detectedLocation = locationMap[data.region_code] || 'Karnataka';
    setUserLocation(detectedLocation);
    return detectedLocation;
  } catch (error) {
    console.log('Location detection failed, using default:', error);
    return 'Karnataka';
  }
};

// Get location display name
export const getLocationDisplayName = (location) => {
  const displayNames = {
    Karnataka: 'Karnataka',
    Maharashtra: 'Maharashtra',
    TamilNadu: 'Tamil Nadu',
    Kerala: 'Kerala',
    Delhi: 'Delhi',
    Rajasthan: 'Rajasthan',
    UttarPradesh: 'Uttar Pradesh',
    Gujarat: 'Gujarat',
    WestBengal: 'West Bengal',
    Goa: 'Goa',
    Uttarakhand: 'Uttarakhand',
    default: 'Default'
  };
  
  return displayNames[location] || location;
};

// Get location-based price multiplier
export const getLocationMultiplier = (pkg, location) => {
  if (!pkg.locationBasedPricing) {
    return 1.0;
  }
  
  return pkg.locationBasedPricing[location] || pkg.locationBasedPricing.default || 1.0;
};

// Calculate location-based price
export const calculateLocationPrice = (basePrice, multiplier) => {
  return Math.round(basePrice * multiplier);
}; 