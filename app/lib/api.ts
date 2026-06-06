const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('stimik_token');
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
    list: (params?: { category?: string; search?: string; page?: number }) => {
      const qs = new URLSearchParams();
      if (params?.category) qs.set('category', params.category);
      if (params?.search) qs.set('search', params.search);
      if (params?.page) qs.set('page', String(params.page));
      return request<{ data: unknown[]; total: number }>(`/api/articles?${qs}`);
    },
    get: (id: string) => request<unknown>(`/api/articles/${id}`),
    create: (body: unknown) =>
      request<unknown>('/api/articles', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      request<unknown>(`/api/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) =>
      request<{ message: string }>(`/api/articles/${id}`, { method: 'DELETE' }),
  },
  programs: {
    list: () => request<unknown[]>('/api/programs'),
    get: (id: string) => request<unknown>(`/api/programs/${id}`),
    update: (id: string, body: unknown) =>
      request<unknown>(`/api/programs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    patchStatus: (id: string, status: 'aktif' | 'nonaktif') =>
      request<unknown>(`/api/programs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};
