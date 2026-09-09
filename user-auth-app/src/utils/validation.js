export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address.';
  return '';
}

export function validatePassword(password, { minLength = 6 } = {}) {
  if (!password) return 'Password is required.';
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }
  return '';
}

export function validateName(name) {
  if (!name.trim()) return 'Name is required.';
  return '';
}

export function validateLogin({ email, password }) {
  return {
    email: validateEmail(email),
    password: password ? '' : 'Password is required.',
  };
}

export function validateSignup({ name, email, password }) {
  return {
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
  };
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
