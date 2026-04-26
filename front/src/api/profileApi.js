import api from "../api";

export function getAuthToken() {
  try {
    const directToken =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("bookshop-token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("jwt") ||
      sessionStorage.getItem("bookshop-token") ||
      sessionStorage.getItem("authToken");

    if (directToken) return directToken;

    const persistedAuth = JSON.parse(
      localStorage.getItem("bookshop-auth") || "null"
    );

    if (persistedAuth?.state?.token) {
      return persistedAuth.state.token;
    }

    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth?.jwt) return auth.jwt;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.jwt) return user.jwt;

    return null;
  } catch {
    return null;
  }
}

export function getApiBase() {
  const raw =
    import.meta.env.VITE_API_URL ||
    "https://163.245.208.70";

  return raw.endsWith("/api") ? raw.slice(0, -4) : raw;
}

export function getMediaUrl(media) {
  if (!media) return null;

  const possibleUrl =
    (typeof media === "string" ? media : null) ||
    media?.url ||
    media?.data?.url ||
    media?.data?.attributes?.url ||
    media?.formats?.thumbnail?.url ||
    media?.data?.attributes?.formats?.thumbnail?.url ||
    null;

  if (!possibleUrl) return null;

  if (possibleUrl.startsWith("http://") || possibleUrl.startsWith("https://")) {
    return possibleUrl;
  }

  return `${getApiBase()}${possibleUrl.startsWith("/") ? possibleUrl : `/${possibleUrl}`}`;
}

export function authConfig(extra = {}) {
  const token = getAuthToken();

  return {
    ...extra,
    headers: {
      ...(extra.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export async function getMyProfile() {
  const { data } = await api.get("/api/profile/me", authConfig());
  return data;
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("files", file);

  const { data } = await api.post(
    "/api/upload",
    formData,
    authConfig({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

  return data?.[0] || null;
}

export async function updateMyProfile(payload) {
  const { data } = await api.put("/api/profile/me", payload, authConfig());
  return data;
}

export async function toggleFavourite(bookId) {
  const { data } = await api.post(
    `/api/profile/favourites/${bookId}/toggle`,
    {},
    authConfig()
  );
  return data;
}

export async function addToCart(bookId, quantity = 1) {
  const { data } = await api.post(
    "/api/profile/cart",
    { bookId, quantity },
    authConfig()
  );
  return data;
}

export async function updateCartQuantity(bookId, quantity) {
  const { data } = await api.patch(
    `/api/profile/cart/${bookId}`,
    { quantity },
    authConfig()
  );
  return data;
}

export async function removeFromCart(bookId) {
  const { data } = await api.delete(
    `/api/profile/cart/${bookId}`,
    authConfig()
  );
  return data;
}