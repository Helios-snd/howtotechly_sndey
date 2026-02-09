import { BlogPost, Category, User } from '../types';

const API_BASE = '/api';

// Helper to get headers with JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Simplified storage for this phase
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// --- Auth ---
export const loginUser = async (email: string, password: string): Promise<{ token: string, user: User }> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }
  return res.json().then(r => r.data);
};

// --- Blogs ---
export const getAdminPosts = async (): Promise<BlogPost[]> => {
  // In a real app, this would hit an admin-specific endpoint or use query params
  // utilizing the public one for now but assuming we might filter client-side or add pagination
  const res = await fetch(`${API_BASE}/posts?limit=100`); 
  if (!res.ok) throw new Error('Failed to fetch posts');
  const json = await res.json();
  return json.data;
};

export const getPostById = async (slugOrId: string): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE}/posts/${slugOrId}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  const json = await res.json();
  return json.data;
};

export const createPost = async (post: Partial<BlogPost>): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error('Failed to create post');
  const json = await res.json();
  return json.data;
};

export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error('Failed to update post');
  const json = await res.json();
  return json.data;
};

export const deletePost = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete post');
};

// --- Categories ---
// Mocking category CRUD as it wasn't fully in backend routes snippet, but required for UI
export const getCategories = async (): Promise<Category[]> => {
  // Mock response if endpoint missing, otherwise fetch
  // return fetch(`${API_BASE}/categories`).then(r => r.json()).then(r => r.data);
  const { MOCK_CATEGORIES } = await import('./mockData'); 
  return MOCK_CATEGORIES;
};

// --- Image Upload (Simulated) ---
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a fake URL for demo purposes
      resolve(URL.createObjectURL(file)); 
    }, 1000);
  });
};
