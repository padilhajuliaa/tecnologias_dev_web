export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6; // Minimum length for password
};

export const validateName = (name) => {
  return name.trim().length > 0; // Name should not be empty
};

export const validateSurname = (surname) => {
  return surname.trim().length > 0; // Surname should not be empty
};

export const validateDateOfBirth = (dateOfBirth) => {
  const date = new Date(dateOfBirth);
  return date instanceof Date && !isNaN(date); // Check if valid date
};