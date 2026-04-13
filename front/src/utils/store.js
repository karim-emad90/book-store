const CART_KEY = "bookshop_cart";
const FAV_KEY = "bookshop_fav";

function toAbsoluteUrl(rawUrl) {
  if (!rawUrl) return null;

  if (typeof rawUrl === "object") {
    rawUrl = rawUrl.url;
  }

  if (typeof rawUrl !== "string") return null;

  if (rawUrl.startsWith("http")) return rawUrl;

  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  return base ? `${base}${rawUrl}` : rawUrl;
}

function getBookId(bookOrId) {
  if (typeof bookOrId === "object" && bookOrId !== null) {
    return String(bookOrId.documentId ?? bookOrId.id ?? "");
  }

  return String(bookOrId ?? "");
}

function normalizeBook(book) {
  const rawUrl =
    book?.coverImageUrl ||
    book?.coverImage?.url ||
    book?.coverImage?.formats?.thumbnail?.url ||
    book?.coverImageUrl?.formats?.thumbnail?.url ||
    null;

  return {
    id: getBookId(book),
    title: book?.title ?? "Untitled",
    author: book?.author ?? "",
    description: book?.description ?? "",
    discountCode: book?.discountCode ?? "",
    isbn13: book?.isbn13 ?? "",
    price: Number(book?.price ?? 0),
    image: toAbsoluteUrl(rawUrl),
  };
}

function notifyStorageUpdate() {
  window.dispatchEvent(new Event("storage-update"));
}

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyStorageUpdate();
}

export function addToCart(book) {
  const cart = getCart();
  const normalizedBook = normalizeBook(book);
  const id = normalizedBook.id;

  const idx = cart.findIndex((item) => String(item.id) === String(id));

  if (idx === -1) {
    cart.push({
      ...normalizedBook,
      qty: 1,
    });
  } else {
    cart[idx] = { ...cart[idx], qty: cart[idx].qty + 1 };
  }

  saveCart(cart);
}

export function addToCartOnce(book) {
  const cart = getCart();
  const normalizedBook = normalizeBook(book);
  const id = normalizedBook.id;

  const exists = cart.find((item) => String(item.id) === String(id));

  if (!exists) {
    cart.push({
      ...normalizedBook,
      qty: 1,
    });

    saveCart(cart);
  }
}

export function removeFromCart(id) {
  const normalizedId = String(id);
  const cart = getCart().filter((item) => String(item.id) !== normalizedId);
  saveCart(cart);
}

export function changeCartQty(id, qty) {
  const normalizedId = String(id);

  const cart = getCart().map((item) =>
    String(item.id) === normalizedId
      ? { ...item, qty: Math.max(1, qty) }
      : item
  );

  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  const cart = getCart();
  return cart.length;
}

export function getFav() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFav(fav) {
  localStorage.setItem(FAV_KEY, JSON.stringify(fav));
  notifyStorageUpdate();
}

export function getFavCount() {
  return getFav().length;
}

export function toggleFav(bookOrId) {
  const id = getBookId(bookOrId);
  const fav = getFav();

  const exists = fav.some((item) => String(item) === id);

  let updated;

  if (exists) {
    updated = fav.filter((item) => String(item) !== id);
  } else {
    updated = [...fav, id];
  }

  saveFav(updated);
  return updated;
}

export function isFav(bookOrId) {
  const id = getBookId(bookOrId);
  const fav = getFav();
  return fav.some((item) => String(item) === id);
}

export const isInCart = (id) => {
  const normalizedId = String(id);
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  return cart.some((item) => String(item.id) === normalizedId);
};