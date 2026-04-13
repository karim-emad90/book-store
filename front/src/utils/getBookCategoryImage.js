import defaultBookImage from "../assets/category/default.jpg";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function getBookImage(book) {
  const fileName =
    book?.coverImageUrl ||
    book?.attributes?.coverImageUrl;

  if (!fileName || typeof fileName !== "string") {
    return defaultBookImage;
  }

  if (fileName.startsWith("http")) return fileName;

  return `${API_URL}/category-images/${fileName}`;
}