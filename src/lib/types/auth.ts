export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  isAdmin?: boolean;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: "admin" | "teacher" | "assistant" | "viewer";
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  ownerId: string;
  schoolId: string;
  user_id: string;
  role: "owner" | "admin" | "teacher" | "assistant" | "viewer";
  createdAt: string;
  profiles?: any;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
