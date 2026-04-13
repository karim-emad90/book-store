import defaultBookImage from "../assets/category/default.jpg";

export function getBookImage(book) {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const fileName = book?.coverImageUrl?.trim();

  console.log("BOOK:", book);
  console.log("BASE URL:", base);
  console.log("FILE NAME:", fileName);

  if (!fileName) {
    return defaultBookImage;
  }

  if (fileName.startsWith("http")) {
    return fileName;
  }

  return `${base}/category-images/${fileName}`;
}