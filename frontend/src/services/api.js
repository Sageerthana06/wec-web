const API_BASE_URL = 'http://localhost:5000/api';

// Fallback logic for media paths
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `http://localhost:5000${path}`;
};

// Set token in request headers helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Raw fetch helpers to avoid axios peer-dependency or versioning conflicts if any
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  // Do not set Content-Type if it is a FormData object (for uploads)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// API Services
export const authService = {
  login: (username, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () =>
    apiFetch('/auth/me', {
      method: 'GET',
    }),
  updatePassword: (currentPassword, newPassword) =>
    apiFetch('/auth/updatepassword', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export const companyService = {
  getDetails: () =>
    apiFetch('/company', {
      method: 'GET',
    }),
  updateDetails: (formData) =>
    apiFetch('/company', {
      method: 'PUT',
      body: formData, // FormData containing details and logo file
    }),
};

export const servicesService = {
  getAll: (isAdmin = false) =>
    apiFetch(`/services?status=${isAdmin ? 'all' : 'active'}`, {
      method: 'GET',
    }),
  create: (formData) =>
    apiFetch('/services', {
      method: 'POST',
      body: formData,
    }),
  update: (id, formData) =>
    apiFetch(`/services/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  delete: (id) =>
    apiFetch(`/services/${id}`, {
      method: 'DELETE',
    }),
};

export const productsService = {
  getAll: (params = {}, isAdmin = false) => {
    const { category, search } = params;
    let url = `/products?status=${isAdmin ? 'all' : 'active'}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return apiFetch(url, { method: 'GET' });
  },
  create: (formData) =>
    apiFetch('/products', {
      method: 'POST',
      body: formData,
    }),
  update: (id, formData) =>
    apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  delete: (id) =>
    apiFetch(`/products/${id}`, {
      method: 'DELETE',
    }),
};

export const galleryService = {
  getAll: (category) => {
    let url = '/gallery';
    if (category) url += `?category=${encodeURIComponent(category)}`;
    return apiFetch(url, { method: 'GET' });
  },
  create: (formData) =>
    apiFetch('/gallery', {
      method: 'POST',
      body: formData,
    }),
  update: (id, formData) =>
    apiFetch(`/gallery/${id}`, {
      method: 'PUT',
      body: formData,
    }),
  delete: (id) =>
    apiFetch(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};

export const messageService = {
  send: (messageData) =>
    apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
  getAll: () =>
    apiFetch('/messages', {
      method: 'GET',
    }),
  markAsRead: (id, status = 'read') =>
    apiFetch(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  delete: (id) =>
    apiFetch(`/messages/${id}`, {
      method: 'DELETE',
    }),
};
