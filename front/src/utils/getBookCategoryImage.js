import defaultBookImage from "../assets/category/default.jpg";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function getBookImage(book) {
  if (!book) return defaultBookImage;

  const fileName = book?.coverImageUrl;

  // 👇 مهم جدًا
  if (!fileName || typeof fileName !== "string") {
    return defaultBookImage;
  }

  // 👇 لو URL كامل
  if (fileName.startsWith("http")) return fileName;

  // 👇 ده المسار الصح
  return `${API_URL}/category-images/${fileName}`;
}