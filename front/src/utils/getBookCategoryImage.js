import defaultBookImage from "../assets/category/default.jpg";

export const getBookImage = (book) => {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fileName =
    book?.image ||
    book?.coverImageUrl ||
    book?.attributes?.coverImageUrl ||
    book?.data?.coverImageUrl;

  if (!fileName || typeof fileName !== "string") {
    return defaultBookImage;
  }

  if (fileName.startsWith("http")) return fileName;

  return `${base}/category-images/${fileName}`;
};