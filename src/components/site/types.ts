"use client";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  popular?: boolean;
  category: string;
  description?: string | null;
  accent: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  count: string;
  accent: string;
  shape: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviews: number;
  tag?: string | null;
  summary: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  shape: string;
  accent: string;
  brand?: Pick<Brand, "name" | "slug" | "accent">;
  category?: Pick<Category, "name" | "slug" | "accent" | "shape">;
  reviews_rel?: Review[];
  related?: Product[];
}

export interface Review {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
}

export type ProductShape =
  | "phone"
  | "laptop"
  | "audio"
  | "gaming"
  | "watch"
  | "accessory";
