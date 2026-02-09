import { Request } from 'express';

// Database Models
export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  username: string;
  role: 'admin' | 'editor';
  created_at: Date;
}

export interface DBPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: string;
  author_id: string;
  is_published: boolean;
  views: number;
  created_at: Date;
  updated_at: Date;
}

// Request Extension for Auth
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
  headers: any;
  body: any;
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}