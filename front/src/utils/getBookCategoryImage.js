

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const getBookImage = (book) => {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fileName = book?.coverImageUrl;

  if (!fileName || typeof fileName !== "string") {
    return richDadBook;
  }

  if (fileName.startsWith("http")) return fileName;

  return `${base}/category-images/${fileName}`;
};