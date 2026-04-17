import defaultBookImage from "../assets/category/default.jpg";

const API_URL = (import.meta.env.VITE_API_URL || "http://163.245.208.70").replace(/\/$/, "");

export const getBookImage = (book) => {
  const fileName =
    book?.coverImageUrl ??
    book?.attributes?.coverImageUrl ??
    book?.data?.coverImageUrl ??
    book?.data?.attributes?.coverImageUrl ??
    null;

  if (!fileName || typeof fileName !== "string" || !fileName.trim()) {
    return defaultBookImage;
  }

  const cleanFileName = fileName.trim();

  if (
    cleanFileName.startsWith("http://") ||
    cleanFileName.startsWith("https://")
  ) {
    return cleanFileName;
  }

  return `${API_URL}/category-images/${cleanFileName}`;
};