// Placeholder authentication API functions
// In a real application, these would make HTTP requests to your backend

let currentUser = null;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Demo users for testing
const demoUsers = [
  { id: 1, name: 'Demo User', email: 'demo@buzz.com', password: 'password123' },
  { id: 2, name: 'John Doe', email: 'john@example.com', password: 'password123' },
];

export async function signUp(userData) {
  await delay(1000);
  
  // Check if user already exists
  const existingUser = demoUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  // Simulate user creation
  const newUser = {
    id: Date.now(),
    name: userData.name,
    email: userData.email,
    password: userData.password, // In real app, this would be hashed
  };
  
  demoUsers.push(newUser);
  
  return {
    success: true,
    message: 'User created successfully',
  };
}

export async function signIn(credentials) {
  await delay(1000);
  
  const user = demoUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Remove password from response
  const { password, ...userInfo } = user;
  currentUser = userInfo;
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('buzz_user', JSON.stringify(userInfo));
  }
  
  return {
    user: userInfo,
    token: 'demo_token_' + user.id,
  };
}

export async function signOut() {
  await delay(500);
  
  currentUser = null;
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('buzz_user');
  }
  
  return { success: true };
}

export async function getSession() {
  await delay(300);
  
  // Check localStorage first
  if (typeof window !== 'undefined' && !currentUser) {
    const storedUser = localStorage.getItem('buzz_user');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
    }
  }
  
  if (!currentUser) {
    throw new Error('No active session');
  }
  
  return {
    user: currentUser,
    authenticated: true,
  };
}

export async function updateProfile(updates) {
  await delay(500);
  
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  // Update current user
  currentUser = { ...currentUser, ...updates };
  
  // Update localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('buzz_user', JSON.stringify(currentUser));
  }
  
  return {
    user: currentUser,
    success: true,
  };
}

export async function resetPassword(email) {
  await delay(1000);
  
  const user = demoUsers.find(u => u.email === email);
  if (!user) {
    throw new Error('No user found with this email');
  }
  
  return {
    success: true,
    message: 'Password reset email sent',
  };
}