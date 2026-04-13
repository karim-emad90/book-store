
import defaultBookImage from "../assets/category/default.jpg";

export function getBookImage(book) {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fileName = book?.coverImageUrl;

  console.log("CART IMAGE:", fileName); // 👈 مؤقت

  if (!fileName || typeof fileName !== "string") {
    return richDadBook;
  }

  if (fileName.startsWith("http")) return fileName;

  return `${base}/category-images/${fileName}`;
}