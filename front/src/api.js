import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://163.245.208.70",
});

const safeJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getToken = () => {
  const directToken =
    localStorage.getItem("jwt") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  if (directToken) return directToken;

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    const parsed = safeJson(raw);

    if (!parsed || typeof parsed !== "object") continue;

    const state = parsed.state || parsed;

    const token =
      state.jwt ||
      state.token ||
      state.authToken ||
      state.accessToken;

    if (token) return token;
  }

  return "";
};

const shouldSkipAuth = (config) => {
  const method = String(config.method || "get").toLowerCase();
  const url = String(config.url || "");

  if (config.skipAuth) return true;

  if (method !== "get") return false;

  const publicGetRoutes = [
    "/api/books",
    "/api/categories",
    "/uploads",
    "/category-images",
  ];

  return publicGetRoutes.some((route) => url.startsWith(route));
};

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (shouldSkipAuth(config)) {
    delete config.headers.Authorization;
    return config;
  }

  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;