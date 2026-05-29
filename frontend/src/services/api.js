import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL.replace("/api", "")}${path}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

apiInstance.interceptors.request.use((config) => {
  config.headers = {
    ...(config.headers || {}),
    ...getAuthHeaders(),
  };
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export const apiFetch = async (endpoint, options = {}) => {
  const { method = "GET", data = null, params = null, headers = {} } = options;
  const response = await apiInstance({
    url: endpoint,
    method,
    data,
    params,
    headers,
  });
  return response;
};

export const authService = {
  login: (username, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      data: { username, password },
    }),
  getMe: () => apiFetch("/auth/me", { method: "GET" }),
  updatePassword: (currentPassword, newPassword) =>
    apiFetch("/auth/updatepassword", {
      method: "PUT",
      data: { currentPassword, newPassword },
    }),
};

export const companyService = {
  getDetails: () => apiFetch("/company", { method: "GET" }),
  updateDetails: (formData) =>
    apiFetch("/company", {
      method: "PUT",
      data: formData,
    }),
};

export const servicesService = {
  getAll: (isAdmin = false) =>
    apiFetch(`/services?status=${isAdmin ? "all" : "active"}`, {
      method: "GET",
    }),
  create: (formData) =>
    apiFetch("/services", {
      method: "POST",
      data: formData,
    }),
  update: (id, formData) =>
    apiFetch(`/services/${id}`, {
      method: "PUT",
      data: formData,
    }),
  delete: (id) => apiFetch(`/services/${id}`, { method: "DELETE" }),
};

export const productsService = {
  getAll: (params = {}, isAdmin = false) => {
    const query = new URLSearchParams({
      status: isAdmin ? "all" : "active",
      ...(params.category ? { category: params.category } : {}),
      ...(params.search ? { search: params.search } : {}),
    }).toString();
    return apiFetch(`/products?${query}`, { method: "GET" });
  },
  create: (formData) =>
    apiFetch("/products", {
      method: "POST",
      data: formData,
    }),
  update: (id, formData) =>
    apiFetch(`/products/${id}`, {
      method: "PUT",
      data: formData,
    }),
  delete: (id) => apiFetch(`/products/${id}`, { method: "DELETE" }),
};

export const galleryService = {
  getAll: (category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return apiFetch(`/gallery${query}`, { method: "GET" });
  },
  create: (formData) =>
    apiFetch("/gallery", {
      method: "POST",
      data: formData,
    }),
  update: (id, formData) =>
    apiFetch(`/gallery/${id}`, {
      method: "PUT",
      data: formData,
    }),
  delete: (id) => apiFetch(`/gallery/${id}`, { method: "DELETE" }),
};

export const messageService = {
  send: (messageData) =>
    apiFetch("/messages", {
      method: "POST",
      data: messageData,
    }),
  getAll: () => apiFetch("/messages", { method: "GET" }),
  markAsRead: (id, status = "read") =>
    apiFetch(`/messages/${id}`, {
      method: "PUT",
      data: { status },
    }),
  delete: (id) => apiFetch(`/messages/${id}`, { method: "DELETE" }),
};
