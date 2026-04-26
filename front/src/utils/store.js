import {
  getCurrentFeatureUserKey,
  isLoggedInForFeatures,
  showLoginRequiredToast,
} from "./featureGuard.jsx";

const CART_PREFIX = "bookshop_cart_";
const FAV_PREFIX = "bookshop_favourites_";
const FAV_ITEMS_PREFIX = "bookshop_favourite_items_";

const LEGACY_FAV_KEYS = [
  "fav",
  "favs",
  "favorites",
  "favourites",
  "wishlist",
  "bookshop_favourites",
  "bookshop_favorites",
];

const safeJson = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const dispatchStorageUpdate = () => {
  window.dispatchEvent(new Event("storage-update"));
};

const normalizeTextId = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

export const getBookKey = (item) => {
  if (typeof item === "string" || typeof item === "number") {
    return normalizeTextId(item);
  }

  return normalizeTextId(
    item?.bookKey ??
      item?.documentId ??
      item?.id ??
      item?.bookId ??
      item?.productId ??
      item?.attributes?.documentId ??
      item?.attributes?.id
  );
};

const sameBook = (a, b) => {
  const aKey = getBookKey(a);
  const bKey = getBookKey(b);
  return Boolean(aKey && bKey && aKey === bKey);
};

const getUserKey = () => getCurrentFeatureUserKey();

const getCartStorageKey = () => `${CART_PREFIX}${getUserKey()}`;
const getFavStorageKey = () => `${FAV_PREFIX}${getUserKey()}`;
const getFavItemsStorageKey = () => `${FAV_ITEMS_PREFIX}${getUserKey()}`;

const readArray = (key) => {
  const value = safeJson(localStorage.getItem(key), []);
  return Array.isArray(value) ? value : [];
};

const writeArray = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const requireLogin = () => {
  if (isLoggedInForFeatures()) return true;
  showLoginRequiredToast();
  return false;
};

const hasUsefulBookData = (item) => {
  if (!item || typeof item !== "object") return false;

  return Boolean(
    item.title ||
      item.author ||
      item.description ||
      item.price ||
      item.coverImageUrl ||
      item.image ||
      item.imgSrc ||
      item.category ||
      item.discountCode
  );
};

const normalizeBookObject = (bookOrId) => {
  const key = getBookKey(bookOrId);

  if (!key) return null;

  if (typeof bookOrId === "string" || typeof bookOrId === "number") {
    return {
      bookKey: key,
      id: key,
      documentId: key,
    };
  }

  const attrs = bookOrId?.attributes || {};
  const merged = {
    ...attrs,
    ...bookOrId,
  };

  return {
    ...merged,
    bookKey: key,
    id: merged.id ?? key,
    documentId: merged.documentId ?? key,
    title: merged.title ?? attrs.title ?? "Untitled",
    author: merged.author ?? attrs.author ?? "",
    description: merged.description ?? attrs.description ?? "",
    price: Number(merged.price ?? attrs.price ?? 0),
    discountCode: merged.discountCode ?? attrs.discountCode ?? "",
    coverImageUrl:
      merged.coverImageUrl ??
      attrs.coverImageUrl ??
      merged.image ??
      merged.imgSrc ??
      "",
    image: merged.image ?? merged.coverImageUrl ?? merged.imgSrc ?? "",
    imgSrc: merged.imgSrc ?? merged.image ?? merged.coverImageUrl ?? "",
  };
};

const normalizeFavIds = (items) => {
  if (!Array.isArray(items)) return [];

  return Array.from(
    new Set(
      items
        .map((item) => getBookKey(item))
        .filter(Boolean)
        .map(String)
    )
  );
};

const normalizeFavItems = (items) => {
  if (!Array.isArray(items)) return [];

  const map = new Map();

  items.forEach((item) => {
    const normalized = normalizeBookObject(item);
    if (!normalized) return;

    const key = getBookKey(normalized);
    const old = map.get(key);

    if (!old) {
      map.set(key, normalized);
      return;
    }

    if (hasUsefulBookData(normalized) && !hasUsefulBookData(old)) {
      map.set(key, {
        ...old,
        ...normalized,
      });
    } else {
      map.set(key, {
        ...normalized,
        ...old,
      });
    }
  });

  return Array.from(map.values());
};

const readFavData = () => {
  const idsFromMain = normalizeFavIds(readArray(getFavStorageKey()));
  const itemsFromMain = normalizeFavItems(readArray(getFavStorageKey()));
  const itemsFromItemsKey = normalizeFavItems(readArray(getFavItemsStorageKey()));

  let ids = [...idsFromMain];
  let items = [...itemsFromItemsKey, ...itemsFromMain];

  LEGACY_FAV_KEYS.forEach((legacyKey) => {
    const legacyArray = readArray(legacyKey);
    ids = [...ids, ...normalizeFavIds(legacyArray)];
    items = [...items, ...normalizeFavItems(legacyArray)];
  });

  ids = Array.from(new Set(ids.filter(Boolean).map(String)));
  items = normalizeFavItems(items);

  const itemMap = new Map(items.map((item) => [getBookKey(item), item]));

  ids.forEach((id) => {
    if (!itemMap.has(id)) {
      itemMap.set(id, {
        bookKey: id,
        id,
        documentId: id,
      });
    }
  });

  items = Array.from(itemMap.values());

  writeArray(getFavStorageKey(), ids);
  writeArray(getFavItemsStorageKey(), items);

  return { ids, items };
};

const saveFavData = (ids, items) => {
  const cleanIds = Array.from(new Set(normalizeFavIds(ids)));
  let cleanItems = normalizeFavItems(items);

  const itemMap = new Map(cleanItems.map((item) => [getBookKey(item), item]));

  cleanIds.forEach((id) => {
    if (!itemMap.has(id)) {
      itemMap.set(id, {
        bookKey: id,
        id,
        documentId: id,
      });
    }
  });

  cleanItems = Array.from(itemMap.values()).filter((item) =>
    cleanIds.includes(getBookKey(item))
  );

  writeArray(getFavStorageKey(), cleanIds);
  writeArray(getFavItemsStorageKey(), cleanItems);

  dispatchStorageUpdate();

  return cleanIds;
};

/* =========================
   Cart
========================= */

const normalizeCartItem = (book, qty = 1) => {
  const normalized = normalizeBookObject(book);
  const key = getBookKey(normalized);

  return {
    ...normalized,
    bookKey: key,
    qty: Math.max(1, Number(book?.qty ?? qty ?? 1)),
    price: Number(book?.price ?? book?.attributes?.price ?? 0),
  };
};

const dedupeCart = (items) => {
  const map = new Map();

  items.forEach((item) => {
    const key = getBookKey(item);
    if (!key) return;

    const normalized = normalizeCartItem(item);

    if (map.has(key)) {
      const old = map.get(key);
      map.set(key, {
        ...old,
        ...normalized,
        qty: Number(old.qty || 1) + Number(normalized.qty || 1),
      });
    } else {
      map.set(key, normalized);
    }
  });

  return Array.from(map.values());
};

export const getCart = () => {
  if (!isLoggedInForFeatures()) return [];

  const current = readArray(getCartStorageKey());

  if (current.length > 0) {
    const cleaned = dedupeCart(current);
    writeArray(getCartStorageKey(), cleaned);
    return cleaned;
  }

  return [];
};

export const saveCart = (items) => {
  if (!isLoggedInForFeatures()) return [];

  const cleaned = dedupeCart(Array.isArray(items) ? items : []);
  writeArray(getCartStorageKey(), cleaned);
  dispatchStorageUpdate();
  return cleaned;
};

export const addToCart = (book, qty = 1) => {
  if (!requireLogin()) return getCart();

  const key = getBookKey(book);
  if (!key) return getCart();

  const cart = getCart();
  const index = cart.findIndex((item) => sameBook(item, key));

  if (index >= 0) {
    cart[index] = {
      ...cart[index],
      qty: Math.max(1, Number(cart[index].qty || 1) + Number(qty || 1)),
    };
  } else {
    cart.push(normalizeCartItem(book, qty));
  }

  return saveCart(cart);
};

export const addToCartOnce = (book) => {
  if (!requireLogin()) return getCart();

  const key = getBookKey(book);
  if (!key) return getCart();

  const cart = getCart();

  if (cart.some((item) => sameBook(item, key))) {
    return cart;
  }

  return saveCart([...cart, normalizeCartItem(book, 1)]);
};

export const removeFromCart = (bookOrId) => {
  const key = getBookKey(bookOrId);
  if (!key) return getCart();

  const updated = getCart().filter((item) => !sameBook(item, key));
  return saveCart(updated);
};

export const changeCartQty = (bookOrId, qty) => {
  const key = getBookKey(bookOrId);
  const nextQty = Number(qty);

  if (!key) return getCart();

  if (nextQty <= 0) {
    return removeFromCart(key);
  }

  const updated = getCart().map((item) =>
    sameBook(item, key)
      ? {
          ...item,
          qty: nextQty,
        }
      : item
  );

  return saveCart(updated);
};

export const isInCart = (bookOrId) => {
  const key = getBookKey(bookOrId);
  if (!key) return false;

  return getCart().some((item) => sameBook(item, key));
};

export const getCartCount = () => {
  return getCart().reduce((total, item) => {
    return total + Number(item.qty || 1);
  }, 0);
};

export const clearCart = () => {
  writeArray(getCartStorageKey(), []);
  dispatchStorageUpdate();
};

/* =========================
   Favourites / Wishlist
========================= */

export const getFav = () => {
  if (!isLoggedInForFeatures()) return [];
  return readFavData().ids;
};

export const getFavItems = () => {
  if (!isLoggedInForFeatures()) return [];
  return readFavData().items;
};

export const saveFav = (items) => {
  if (!isLoggedInForFeatures()) return [];

  const ids = normalizeFavIds(items);
  const favItems = normalizeFavItems(items);

  return saveFavData(ids, favItems);
};

export const addToFavourites = (bookOrId) => {
  if (!requireLogin()) return getFav();

  const key = getBookKey(bookOrId);
  if (!key) return getFav();

  const { ids, items } = readFavData();

  const nextIds = ids.includes(key) ? ids : [...ids, key];

  const normalized = normalizeBookObject(bookOrId);
  const nextItems = [
    ...items.filter((item) => getBookKey(item) !== key),
    normalized,
  ];

  return saveFavData(nextIds, nextItems);
};

export const removeFromFav = (bookOrId) => {
  const key = getBookKey(bookOrId);
  if (!key) return getFav();

  const { ids, items } = readFavData();

  const nextIds = ids.filter((item) => String(item) !== String(key));
  const nextItems = items.filter((item) => getBookKey(item) !== key);

  LEGACY_FAV_KEYS.forEach((legacyKey) => {
    const legacy = readArray(legacyKey);
    if (!legacy.length) return;

    writeArray(
      legacyKey,
      legacy.filter((item) => getBookKey(item) !== key)
    );
  });

  return saveFavData(nextIds, nextItems);
};

export const toggleFav = (bookOrId) => {
  if (!requireLogin()) return getFav();

  const key = getBookKey(bookOrId);
  if (!key) return getFav();

  const { ids, items } = readFavData();
  const exists = ids.some((item) => String(item) === String(key));

  if (exists) {
    const nextIds = ids.filter((item) => String(item) !== String(key));
    const nextItems = items.filter((item) => getBookKey(item) !== key);

    return saveFavData(nextIds, nextItems);
  }

  const normalized = normalizeBookObject(bookOrId);

  return saveFavData([...ids, key], [
    ...items.filter((item) => getBookKey(item) !== key),
    normalized,
  ]);
};

export const isFav = (bookOrId) => {
  const key = getBookKey(bookOrId);
  if (!key) return false;

  return getFav().some((item) => String(item) === String(key));
};

export const getFavCount = () => getFav().length;

export const clearLegacyAuth = () => {
  [
    "jwt",
    "token",
    "authToken",
    "accessToken",
    "user",
    "authUser",
    "bookshop_user",
  ].forEach((key) => {
    localStorage.removeItem(key);
  });

  dispatchStorageUpdate();
};

/* Old names */
export const getFavourites = getFav;
export const getFavorites = getFav;
export const getWishlist = getFav;

export const addToFavorites = addToFavourites;

export const removeFromFavourites = removeFromFav;
export const removeFromFavorites = removeFromFav;
export const removeFromWishlist = removeFromFav;

export const getCartItems = getCart;
export const getFavouriteItems = getFavItems;
export const getFavoriteItems = getFavItems;
export const getWishlistItems = getFavItems;