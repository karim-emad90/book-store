import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api";
import { getMyProfile } from "../api/profileApi";

const LEGACY_USER_KEYS = ["user", "bookshop-user", "authUser"];
const LEGACY_TOKEN_KEYS = ["token", "jwt", "bookshop-token", "authToken"];

function safeDispatchStorageUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage-update"));
  }
}

function writeLegacyAuth(user, token) {
  try {
    if (typeof window === "undefined") return;

    if (token) {
      LEGACY_TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
    } else {
      LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
    }

    if (user) {
      const serialized = JSON.stringify(user);
      LEGACY_USER_KEYS.forEach((key) => localStorage.setItem(key, serialized));
    } else {
      LEGACY_USER_KEYS.forEach((key) => localStorage.removeItem(key));
    }
  } catch (error) {
    console.error("Failed to write legacy auth:", error);
  }
}

function clearLegacyAuth() {
  try {
    if (typeof window === "undefined") return;

    LEGACY_TOKEN_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    LEGACY_USER_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Do NOT remove cart/favorites here.
    // Cart and wishlist are saved per user in src/utils/store.js,
    // so logout must only clear auth data.
  } catch (error) {
    console.error("Failed to clear legacy auth:", error);
  }
}

const normalizeMedia = (media) => {
  if (!media) return null;

  if (Array.isArray(media)) return media[0] || null;

  if (media?.data) {
    const data = Array.isArray(media.data) ? media.data[0] : media.data;
    return {
      id: data?.id,
      ...(data?.attributes || {}),
      ...(data || {}),
    };
  }

  return media;
};

export const normalizeAuthUser = (user) => {
  if (!user) return null;

  const attributes = user.attributes || {};

  return {
    id: user.id || attributes.id || null,
    username: user.username || attributes.username || "",
    email: user.email || attributes.email || "",
    first_name:
      user.first_name ||
      user.firstName ||
      attributes.first_name ||
      attributes.firstName ||
      "",
    last_name:
      user.last_name ||
      user.lastName ||
      attributes.last_name ||
      attributes.lastName ||
      "",
    phone: user.phone || attributes.phone || "",
    address: user.address || attributes.address || "",
    avatar: normalizeMedia(user.avatar || attributes.avatar),
  };
};

const mergeProfileIntoUser = (authUser, profile) => {
  if (!authUser && !profile) return null;

  const normalizedAuth = normalizeAuthUser(authUser);
  const normalizedProfile = normalizeAuthUser(profile);

  return {
    id: normalizedAuth?.id || normalizedProfile?.id || null,
    username: normalizedProfile?.username || normalizedAuth?.username || "",
    email: normalizedProfile?.email || normalizedAuth?.email || "",
    first_name: normalizedProfile?.first_name || normalizedAuth?.first_name || "",
    last_name: normalizedProfile?.last_name || normalizedAuth?.last_name || "",
    phone: normalizedProfile?.phone || normalizedAuth?.phone || "",
    address: normalizedProfile?.address || normalizedAuth?.address || "",
    avatar: normalizedProfile?.avatar || normalizedAuth?.avatar || null,
  };
};

function makeUsername({ username, email, first_name, last_name }) {
  const manualUsername = username?.trim();
  if (manualUsername) return manualUsername;

  const fullName = `${first_name || ""} ${last_name || ""}`.trim();
  if (fullName) return fullName;

  const emailPrefix = email?.split("@")[0]?.trim();
  return emailPrefix || `user_${Date.now().toString().slice(-6)}`;
}

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      authChecked: false,
      error: null,

      setUser: (user) => {
        const normalizedUser = normalizeAuthUser(user);
        const currentToken = get().token;

        set({ user: normalizedUser, error: null });
        writeLegacyAuth(normalizedUser, currentToken);
        safeDispatchStorageUpdate();
      },

      setToken: (token) => {
        const currentUser = get().user;
        set({ token });
        writeLegacyAuth(currentUser, token);
        safeDispatchStorageUpdate();
      },

      clearError: () => set({ error: null }),

      refreshProfileFromApi: async () => {
        try {
          const currentUser = get().user;
          const currentToken = get().token;

          let profile = null;

          try {
            profile = await getMyProfile();
          } catch {
            const res = await api.get("/api/users/me?populate=*");
            profile = res.data;
          }

          const mergedUser = mergeProfileIntoUser(currentUser, profile);

          set({
            user: mergedUser,
            error: null,
          });

          writeLegacyAuth(mergedUser, currentToken);
          safeDispatchStorageUpdate();

          return { success: true, user: mergedUser };
        } catch (error) {
          return { success: false, error };
        }
      },

      login: async ({ identifier, password }) => {
        set({ loading: true, error: null });

        try {
          const res = await api.post("/api/auth/local", {
            identifier,
            password,
          });

          const token = res?.data?.jwt || null;
          const authUser = normalizeAuthUser(res?.data?.user);

          if (!token || !authUser) {
            throw new Error("Login response is incomplete");
          }

          set({
            token,
            user: authUser,
            loading: false,
            authChecked: true,
            error: null,
          });

          writeLegacyAuth(authUser, token);

          try {
            const profileResult = await get().refreshProfileFromApi();
            if (profileResult.success) {
              return { success: true, user: profileResult.user };
            }
          } catch {}

          safeDispatchStorageUpdate();
          return { success: true, user: get().user };
        } catch (err) {
          const message =
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            err?.message ||
            "Login failed";

          set({
            loading: false,
            error: message,
          });

          return { success: false, error: message };
        }
      },

      register: async ({
        username,
        email,
        password,
        first_name = "",
        last_name = "",
      }) => {
        set({ loading: true, error: null });

        try {
          const safeFirstName = first_name?.trim() || "";
          const safeLastName = last_name?.trim() || "";
          const safeEmail = email?.trim()?.toLowerCase() || "";
          const safeUsername = makeUsername({
            username,
            email: safeEmail,
            first_name: safeFirstName,
            last_name: safeLastName,
          });

          // Strapi register can reject extra fields unless allowedFields is configured.
          // So registration is kept clean, then profile data is saved after login.
          const res = await api.post("/api/auth/local/register", {
            username: safeUsername,
            email: safeEmail,
            password,
          });

          const token = res?.data?.jwt || null;
          const authUser = normalizeAuthUser(res?.data?.user);

          if (!token || !authUser) {
            throw new Error("Register response is incomplete");
          }

          const userWithSignupData = {
            ...authUser,
            first_name: safeFirstName || authUser.first_name || "",
            last_name: safeLastName || authUser.last_name || "",
          };

          set({
            token,
            user: userWithSignupData,
            loading: false,
            authChecked: true,
            error: null,
          });

          writeLegacyAuth(userWithSignupData, token);

          // Try to persist first/last name in Strapi. If permissions/fields are not ready,
          // signup still succeeds and the local profile form remains prefilled.
          if ((safeFirstName || safeLastName) && authUser.id) {
            try {
              await api.put(
                `/api/users/${authUser.id}`,
                {
                  first_name: safeFirstName,
                  last_name: safeLastName,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            } catch (updateError) {
              console.warn("Signup profile fields were saved locally only:", updateError);
            }
          }

          safeDispatchStorageUpdate();
          return { success: true, user: get().user };
        } catch (err) {
          const message =
            err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            err?.message ||
            "Registration failed";

          set({
            loading: false,
            error: message,
          });

          return { success: false, error: message };
        }
      },

      initializeAuth: async () => {
        const token = get().token;

        if (!token) {
          set({
            user: null,
            token: null,
            loading: false,
            authChecked: true,
            error: null,
          });
          clearLegacyAuth();
          safeDispatchStorageUpdate();
          return;
        }

        set({ loading: true, error: null });

        try {
          const res = await api.get("/api/users/me?populate=*", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const authUser = normalizeAuthUser(res.data);
          const currentLocalUser = get().user;
          const mergedLocalUser = mergeProfileIntoUser(authUser, currentLocalUser);

          set({
            user: mergedLocalUser,
            loading: false,
            authChecked: true,
            error: null,
          });

          writeLegacyAuth(mergedLocalUser, token);

          try {
            await get().refreshProfileFromApi();
          } catch {}

          safeDispatchStorageUpdate();
        } catch {
          clearLegacyAuth();

          set({
            user: null,
            token: null,
            loading: false,
            authChecked: true,
            error: "Session expired. Please login again.",
          });

          safeDispatchStorageUpdate();
        }
      },

      logout: () => {
        clearLegacyAuth();

        try {
          if (typeof window !== "undefined") {
            localStorage.removeItem("bookshop-auth");
            sessionStorage.removeItem("bookshop-auth");
          }
        } catch (error) {
          console.error("Failed to clear persisted auth:", error);
        }

        set({
          user: null,
          token: null,
          loading: false,
          authChecked: true,
          error: null,
        });

        safeDispatchStorageUpdate();
      },
    }),
    {
      name: "bookshop-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useStore;
