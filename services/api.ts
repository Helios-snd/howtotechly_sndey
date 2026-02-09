import { BlogPost, Category, User } from '../types';
import { MOCK_BLOGS, MOCK_CATEGORIES } from './mockData';

// Use relative path to leverage Vite proxy in dev and relative paths in prod
const API_BASE = '/api';

interface AuthResponse {
  token: string;
  user: User;
}

// --- Helpers ---
const getHeaders = (auth = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = localStorage.getItem('authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

// --- Authentication ---
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  // No mock fallback. If auth fails, it fails.
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password }),
  });
  return await handleResponse(res);
};

// --- Public Data Fetching ---
export const fetchPosts = async (params: { limit?: number; search?: string; category?: string; tag?: string } = {}): Promise<BlogPost[]> => {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.category) query.append('category', params.category);
  if (params.tag) query.append('tag', params.tag);

  try {
    const res = await fetch(`${API_BASE}/posts?${query.toString()}`);
    return await handleResponse(res);
  } catch (error) {
    console.warn("API unavailable, falling back to static mock data.", error);
    // Return static mocks only for read-only public views if server is down
    return MOCK_BLOGS.filter(p => p.isPublished); 
  }
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost> => {
  try {
    const res = await fetch(`${API_BASE}/posts/${slug}`);
    return await handleResponse(res);
  } catch (error) {
    console.warn("API unavailable, checking static mocks.", error);
    const post = MOCK_BLOGS.find(p => p.slug === slug || p.id === slug);
    if (!post) throw new Error('Post not found');
    return post;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    return await handleResponse(res);
  } catch (error) {
    console.warn("API unavailable, returning static mock categories.", error);
    return MOCK_CATEGORIES;
  }
};

// --- Admin Data Management ---
// REMOVED ALL MOCK FALLBACKS FOR WRITES
// This ensures that if the server rejects the image (size) or db is down, the user sees the error.

export const fetchAdminPosts = async (): Promise<BlogPost[]> => {
  const res = await fetch(`${API_BASE}/admin/posts`, {
    headers: getHeaders(true)
  });
  return await handleResponse(res);
};

export const createPost = async (post: Partial<BlogPost>): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(post),
  });
  return await handleResponse(res);
};

export const updatePost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(post),
  });
  return await handleResponse(res);
};

export const deletePost = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return await handleResponse(res);
};

export const createCategory = async (cat: Partial<Category>): Promise<Category> => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(cat),
  });
  return await handleResponse(res);
};

export const updateCategory = async (id: string, cat: Partial<Category>): Promise<Category> => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(cat),
  });
  return await handleResponse(res);
};

// Client-side helper, no backend involved
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};