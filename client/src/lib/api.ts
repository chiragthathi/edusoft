import axios from 'axios';
import type { Category, Faq, Job, NewsItem, Office, ProductDetail, ProductSummary } from './types';

/**
 * API origin. In production set VITE_API_URL to the backend deployment
 * (e.g. https://edusoft-ul7j.vercel.app). Unset in development, so requests
 * stay relative and go through Vite's /api proxy to localhost:5000.
 */
export const API_ORIGIN = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Tiny request cache: identical GETs share one in-flight promise and the
 * settled result for the session. The header mega-menu, homepage and
 * portfolio all read the catalogue without refetching it.
 */
const cache = new Map<string, Promise<unknown>>();
function cached<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const clean = params ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')) : undefined;
  const key = url + (clean ? JSON.stringify(clean) : '');
  let hit = cache.get(key) as Promise<T> | undefined;
  if (!hit) {
    hit = api.get<T>(url, { params: clean }).then(r => r.data);
    hit.catch(() => cache.delete(key)); // don't cache failures
    cache.set(key, hit);
  }
  return hit;
}

export const productsApi = {
  getAll: (params?: { category?: string; search?: string; featured?: boolean }) =>
    cached<ProductSummary[]>('/products', params && { ...params, featured: params.featured ? 1 : undefined }),
  getCategories: () => cached<Category[]>('/products/categories'),
  getBySlug: (slug: string) => cached<ProductDetail>(`/products/${slug}`),
};

export const newsApi = {
  getAll: (params?: { category?: string; search?: string; lang?: string }) =>
    cached<NewsItem[]>('/news', params),
  getBySlug: (slug: string, lang?: string) =>
    cached<NewsItem & { related: NewsItem[] }>(`/news/${slug}`, { lang }),
};

export const jobsApi = {
  getAll: (params?: { department?: string; location?: string }) => cached<Job[]>('/jobs', params),
  getDepartments: () => cached<string[]>('/jobs/departments'),
  getBySlug: (slug: string) => cached<Job>(`/jobs/${slug}`),
};

export const faqsApi = {
  getAll: (params?: { category?: string; search?: string }) => cached<Faq[]>('/faqs', params),
};

export const officesApi = {
  getAll: () => cached<Office[]>('/offices'),
};

export const contactApi = {
  submit: (data: Record<string, string>) =>
    api.post('/contact', data).then(r => r.data),
};

export default api;
