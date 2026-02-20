export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validateZip = (zip) => {
  return /^\d{5}$/.test(zip);
};

export const validateBidAmount = (bidAmount, reserveAmount) => {
  const bid = parseFloat(bidAmount);
  return !isNaN(bid) && bid > reserveAmount;
};
