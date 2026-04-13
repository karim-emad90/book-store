import defaultBookImage from "../assets/category/default.jpg";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function getBookImage(book) {
  if (!book) return defaultBookImage;

  const rawUrl =
    book?.coverImageUrl?.url ||
    book?.coverImageUrl?.formats?.medium?.url ||
    book?.coverImageUrl?.formats?.small?.url ||
    book?.coverImageUrl?.formats?.thumbnail?.url ||
    null;

  if (!rawUrl) return defaultBookImage;

  if (rawUrl.startsWith("http")) return rawUrl;

  return `${API_URL}${rawUrl}`;
}