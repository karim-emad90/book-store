export function normalizeBookForCart(book) {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const rawUrl = book?.coverImage?.url || null;

  const coverImageUrl =
    rawUrl && base
      ? rawUrl.startsWith("http")
        ? rawUrl
        : `${base}${rawUrl}`
      : rawUrl;

  return {
    ...book,
    coverImageUrl, // ✅ هيتخزن في store.js كـ item.image
  };
}