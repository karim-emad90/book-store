import { getCategoryImage } from "../utils/categoryImages";

export default function CategoryCard({ category }) {
  const image = getCategoryImage(category.slug || category.name);

  return (
    <div className="rounded-xl overflow-hidden shadow bg-white">
      <img
        src={image}
        alt={category.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{category.name}</h3>
      </div>
    </div>
  );
}