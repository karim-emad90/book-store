import defaultBookImage from "../assets/category/default.jpg";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function getBookImage(book) {
  if (!book) return defaultBookImage;

  const fileName = book?.coverImageUrl;

  if (!fileName) return defaultBookImage;

  if (fileName.startsWith("http")) return fileName;

  return `${API_URL}/category-images/${fileName}`;
}