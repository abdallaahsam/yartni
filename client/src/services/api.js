const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('yareetni_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'حدث خطأ في الاتصال بالخادم');
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Categories & Ages
  getCategories: () => request('/categories'),
  getAges: () => request('/ages'),

  // Advices
  getAdvices: (params = {}) => {
    const query = new URLSearchParams();
    if (params.target_age) query.append('target_age', params.target_age);
    if (params.category_slug) query.append('category_slug', params.category_slug);
    if (params.sort) query.append('sort', params.sort);
    if (params.q) query.append('q', params.q);
    if (params.page) query.append('page', params.page);
    return request(`/advices?${query.toString()}`);
  },
  getAdvice: (id) => request(`/advices/${id}`),
  createAdvice: (body) => request('/advices', { method: 'POST', body: JSON.stringify(body) }),
  toggleImpact: (id) => request(`/advices/${id}/impact`, { method: 'POST' }),
  toggleBookmark: (id) => request(`/advices/${id}/bookmark`, { method: 'POST' }),
  reportAdvice: (id, reason) => request(`/advices/${id}/report`, { method: 'POST', body: JSON.stringify({ reason }) }),

  // Comments
  getComments: (adviceId) => request(`/advices/${adviceId}/comments`),
  addComment: (adviceId, content) => request(`/advices/${adviceId}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),

  // User Profile
  getUserProfile: (username) => request(`/users/@${username}`),
  getMyBookmarks: () => request('/users/me/bookmarks'),
  updateProfile: (body) => request('/users/me/profile', { method: 'PUT', body: JSON.stringify(body) }),
};
