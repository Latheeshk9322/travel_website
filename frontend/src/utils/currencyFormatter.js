// Format currency in Indian Rupees
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency in Indian Rupees (simple version without currency symbol)
export const formatINRSimple = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format currency in Indian Rupees (with decimal places)
export const formatINRWithDecimals = (amount, decimals = 2) => {
  if (!amount && amount !== 0) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

// Format number in Indian format (without currency symbol)
export const formatIndianNumber = (number) => {
  if (!number && number !== 0) return '0';
  
  return new Intl.NumberFormat('en-IN').format(number);
}; 