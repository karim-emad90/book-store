import React from "react";
import { toast } from "react-hot-toast";

const safeJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export function getAuthSnapshot() {
  let user = null;
  let jwt = "";

  const directUser =
    safeJson(localStorage.getItem("user")) ||
    safeJson(localStorage.getItem("bookshop_user")) ||
    safeJson(localStorage.getItem("authUser"));

  if (directUser) user = directUser;

  jwt =
    localStorage.getItem("jwt") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    "";

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    const parsed = safeJson(raw);

    if (!parsed || typeof parsed !== "object") continue;

    const state = parsed.state || parsed;

    if (!user && state.user) user = state.user;

    if (!jwt) {
      jwt =
        state.jwt ||
        state.token ||
        state.authToken ||
        state.accessToken ||
        "";
    }
  }

  return { user, jwt };
}

export function isLoggedInForFeatures() {
  const { user, jwt } = getAuthSnapshot();

  return Boolean(
    jwt ||
      user?.id ||
      user?.documentId ||
      user?.email ||
      user?.username
  );
}

export function getCurrentFeatureUserKey() {
  const { user, jwt } = getAuthSnapshot();

  return String(
    user?.id ||
      user?.documentId ||
      user?.email ||
      user?.username ||
      jwt ||
      "guest"
  );
}

export function showLoginRequiredToast() {
  window.dispatchEvent(new CustomEvent("bookshop-login-required"));
}

export function LoginRequiredToast({ t }) {
  return (
    <div className="w-[92vw] max-w-[420px] overflow-hidden rounded-[24px] border border-white/40 bg-white/95 shadow-[0_18px_60px_rgba(34,34,34,0.20)] backdrop-blur-xl">
      <div className="px-5 py-5">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9176C]/10 text-[22px]">
          🔒
        </div>

        <h3 className="text-center text-[18px] font-bold text-[#222222]">
          cannot use these features until login
        </h3>

        <p className="mt-2 text-center text-[13px] leading-5 text-[#22222299]">
          Login first to add books to your cart or favourites.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = "/login";
            }}
            className="h-11 rounded-2xl bg-[#D9176C] text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(217,23,108,0.28)] transition active:scale-95"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="h-11 rounded-2xl border border-[#2222221A] bg-[#F7F3F8] text-[14px] font-semibold text-[#43264F] transition active:scale-95"
          >
            Keep Shopping
          </button>
        </div>
      </div>
    </div>
  );
}