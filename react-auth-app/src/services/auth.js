const USERS_KEY = 'admin@gmail.com';
const CURRENT_KEY = 'demo_current_user';

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();

  if (users.some(u => u.email === emailLower)) {
    throw new Error('Email is already registered.');
  }
  const newUser = { id: crypto.randomUUID(), name: name.trim(), email: emailLower, password };
  users.push(newUser);
  saveUsers(users);
  // auto-login on register (optional). Comment out if you prefer redirect to login.
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

export function loginUser({ email, password }) {
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();
  const found = users.find(u => u.email === emailLower && u.password === password);
  if (!found) throw new Error('Invalid email or password.');
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ id: found.id, name: found.name, email: found.email }));
  return { id: found.id, name: found.name, email: found.email };
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_KEY);
  return raw ? JSON.parse(raw) : null;
}