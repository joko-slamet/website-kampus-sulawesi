const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface GeneratedArticle {
  id: string;
  image: string | null;
  title: string;
  excerpt: string;
  titleEn: string;
  excerptEn: string;
  category: string;
  categoryColor: string;
  tag: string | null;
  tagColor: string | null;
  readTime: string;
  date: string;
  views: number;
  published: boolean;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('stia_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      ),
    me: () =>
      request<{ id: string; name: string; email: string; role: string }>('/api/auth/me'),
  },
  articles: {
    list: (params?: { category?: string; search?: string; page?: number; limit?: number; all?: boolean }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set('category', params.category);
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.all) qs.set('all', 'true');
      return request<{ data: unknown[]; total: number }>(`/api/articles?${qs}`);
    },
    stats: () => request<{ articles: { total: number; published: number; draft: number }; totalViews: number; news: number; leads: number }>('/api/articles/stats'),
    get: (id: string) => request<unknown>(`/api/articles/${id}`),
    create: (body: unknown) =>
      request<unknown>('/api/articles', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request<unknown>(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/articles/${id}`, { method: 'DELETE' }),
    generate: () =>
      request<GeneratedArticle>('/api/articles/generate', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
    uploadImage: (file: File) => {
      const token = getToken();
      const form = new FormData();
      form.append('image', file);
      return fetch(`${BASE_URL}/api/articles/upload-image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? 'Upload failed');
        return data as { url: string; filename: string };
      });
    },
  },
  scheduler: {
    get: () =>
      request<{ enabled: boolean; times: string[] }>('/api/scheduler'),
    update: (enabled: boolean, times: string[]) =>
      request<{ enabled: boolean; times: string[] }>('/api/scheduler', {
        method: 'PUT',
        body: JSON.stringify({ enabled, times }),
      }),
    runNow: () =>
      request<{ message: string }>('/api/scheduler/run', { method: 'POST' }),
  },
  whatsapp: {
    stats: (from?: Date, to?: Date) => {
      const qs = new URLSearchParams();
      if (from) qs.set('from', from.toISOString());
      if (to) qs.set('to', to.toISOString());
      return request<{ total: number; last7Days: number; last30Days: number; byPage: { page: string; count: number }[] }>(
        `/api/whatsapp/stats?${qs}`
      );
    },
    daily: (from?: Date, to?: Date) => {
      const qs = new URLSearchParams();
      if (from) qs.set('from', from.toISOString());
      if (to) qs.set('to', to.toISOString());
      return request<{ day: string; count: number }[]>(`/api/whatsapp/daily?${qs}`);
    },
  },
  news: {
    list: (params?: { type?: string; category?: string; search?: string; page?: number; limit?: number; all?: boolean }) => {
      const qs = new URLSearchParams();
      if (params?.type) qs.set('type', params.type);
      if (params?.category) qs.set('category', params.category);
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.all) qs.set('all', 'true');
      return request<{ data: unknown[]; total: number }>(`/api/news?${qs}`);
    },
    get: (id: string) => request<unknown>(`/api/news/${id}`),
    create: (body: unknown) =>
      request<unknown>('/api/news', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request<unknown>(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/news/${id}`, { method: 'DELETE' }),
    generate: (title: string, type: 'news' | 'announcement') =>
      request<{ content: string; category: string; tag: string }>('/api/news/generate', {
        method: 'POST',
        body: JSON.stringify({ title, type }),
      }),
    uploadImage: (file: File) => {
      const token = getToken();
      const form = new FormData();
      form.append('image', file);
      return fetch(`${BASE_URL}/api/news/upload-image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? 'Upload failed');
        return data as { url: string; filename: string };
      });
    },
  },
  programs: {
    list: () => request<unknown[]>('/api/programs'),
    get: (id: string) => request<unknown>(`/api/programs/${id}`),
    update: (id: string, body: unknown) =>
      request<unknown>(`/api/programs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    patchStatus: (id: string, status: 'aktif' | 'nonaktif') =>
      request<unknown>(`/api/programs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  leads: {
    create: (data: { name: string; phone: string; program?: string; school?: string; message?: string }) =>
      request<{ ok: boolean; id: string }>('/api/leads', { method: 'POST', body: JSON.stringify(data) }),
    list: (page = 1, limit = 20) =>
      request<{ data: unknown[]; total: number }>(`/api/leads?page=${page}&limit=${limit}`),
    daily: (from?: string, to?: string) => {
      const qs = new URLSearchParams();
      if (from) qs.set('from', from);
      if (to) qs.set('to', to);
      return request<{ day: string; count: number }[]>(`/api/leads/daily?${qs}`);
    },
  },
};
