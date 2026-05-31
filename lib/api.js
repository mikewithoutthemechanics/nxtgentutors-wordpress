const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

async function fetchAPI(endpoint, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch API');
  }

  return res.json();
}

async function fetchLocal(endpoint, options = {}) {
  const res = await fetch(endpoint, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return res.json();
}

export const api = {
  searchTutors: (query) => fetchAPI(`/tutors/search?${new URLSearchParams(query)}`),
  getDashboard: (token) => fetchAPI('/dashboard', { token }),
  getSessions: (token) => fetchAPI('/sessions', { token }),
  submitRating: (data, token) => fetchAPI('/ratings', { method: 'POST', body: data, token }),

  aiChat: (messages, subject) => fetchLocal('/api/ai-chat', { method: 'POST', body: { messages, subject } }),
  generateStudyPlan: (data) => fetchLocal('/api/study-plan', { method: 'POST', body: data }),
  initiatePayment: (data) => fetchLocal('/api/payfast', { method: 'POST', body: data }),
  auth: (data) => fetchLocal('/api/auth', { method: 'POST', body: data }),
};
