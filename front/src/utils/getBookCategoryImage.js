import defaultBookImage from "../assets/category/default.jpg";

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

  return `/category-images/${cleanFileName}`;
};