import businessImg from "../assets/categories/business.jpg";
import scienceImg from "../assets/categories/science.jpg";
import historyImg from "../assets/categories/history.jpg";
import novelsImg from "../assets/categories/novels.jpg";
import childrenImg from "../assets/categories/children.jpg";
import religionImg from "../assets/categories/religion.jpg";
import technologyImg from "../assets/categories/technology.jpg";
import selfDevelopmentImg from "../assets/categories/self-development.jpg";
import artImg from "../assets/categories/art.jpg";
import educationImg from "../assets/categories/education.jpg";
import defaultImg from "../assets/categories/default.jpg";

const categoryImages = {
  business: businessImg,
  science: scienceImg,
  history: historyImg,
  novels: novelsImg,
  children: childrenImg,
  religion: religionImg,
  technology: technologyImg,
  "self-development": selfDevelopmentImg,
  art: artImg,
  education: educationImg,
};

export function getCategoryImage(category) {
  if (!category) return defaultImg;

  const key = String(category).trim().toLowerCase();
  return categoryImages[key] || defaultImg;
}