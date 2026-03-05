

const CART_KEY = "bookshop_cart";
const FAV_KEY = "bookshop_fav";

function toAbsoluteUrl(rawUrl) {
  if (!rawUrl) return null;
  if (rawUrl.startsWith("http")) return rawUrl;
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  return base ? `${base}${rawUrl}` : rawUrl;
}

export function addToCart(book) {
  const cart = getCart();
  const id = book?.documentId ?? book?.id;

  // ✅ التقط الصورة من أي شكل محتمل
  const rawUrl =
    book?.coverImageUrl ||
    book?.coverImage?.url ||                 // ✅ ده شكل بياناتك
    book?.coverImageUrl?.formats?.thumbnail?.url || // احتياطي
    null;

  const image = toAbsoluteUrl(rawUrl);

  const idx = cart.findIndex((item) => item.id === id);

  if (idx === -1) {
    cart.push({
      id,
      title: book?.title,
      author: book?.author,
      description: book?.description,
      discountCode: book?.discountCode,
      isbn13: book?.isbn13,
      price: Number(book?.price ?? 0),
      image, // ✅ هيتخزن URL هنا
      qty: 1,
    });
  } else {
    cart[idx] = { ...cart[idx], qty: cart[idx].qty + 1 };
  }

  saveCart(cart);
}



function normalizeBook(book) {
  return {
    id: book.documentId ?? book.id,
    title: book.title ?? "Untitled",
    author: book.author ?? "",
    description: book.description ?? "",
    discountCode: book.discountCode ?? "",
    isbn13: book.isbn13 ?? "",
    price: Number(book.price ?? 0),
    image: book.coverImageUrl ?? null,
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
  console.log("✅ saveCart called. cart =", cart);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  console.log("✅ localStorage now =", localStorage.getItem(CART_KEY));
  notifyStorageUpdate();
}

export function addToCartOnce(book) {
  const cart = getCart();

  const id = book.documentId;
  const exists = cart.find((item) => item.id === id);

  if (!exists) {
    cart.push({
      id,
      title: book.title ,
      author:book.author,
      description:book.description,
      discountCode:book.discountCode,
      isbn13:book.isbn13,
      price: book.price ?? 0,
      image: book.coverImageUrl ??  null,
      qty: 1,
    });
    saveCart(cart);
  }
}



export function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

export function changeCartQty(id, qty) {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, qty: Math.max(1, qty) } : item
  );
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  // عدد العناصر (ممكن تخليه مجموع الكميات)
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

// لو عندك fav functions موجودة سيبها زي ما هي
export function getFavCount() {
  try {
    const fav = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    return fav.length;
  } catch {
    return 0;
  }
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

export function toggleFav(id) {
  const fav = getFav();

  const exists = fav.includes(id);

  let updated;

  if (exists) {
    updated = fav.filter((item) => item !== id);
  } else {
    updated = [...fav, id];
  }

  saveFav(updated);
}

export function isFav(id) {
  const fav = getFav();
  return fav.includes(id);
}