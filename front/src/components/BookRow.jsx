import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa"; // قلب filled
import RatingStars from "../store/RatingStars";
import { addToCart } from "../utils/store";
import { useNavigate } from "react-router-dom";
import {toggleFav,isFav} from "../utils/store"


export default function BookRow({ book, imgSrc }) {
  const bookId = book.documentId;

  // ✅ Hook هنا عادي لأنه ثابت لكل كومبوننت
  const [fav, setFav] = useState(() => isFav(bookId));

  const navigate = useNavigate();

  // ✅ عشان لو الهيدر/مكان تاني عمل تحديث
  useEffect(() => {
    const update = () => setFav(isFav(bookId));
    window.addEventListener("storage-update", update);
    return () => window.removeEventListener("storage-update", update);
  }, [bookId]);

  const onToggleFav = () => {
    toggleFav(bookId);       // يضيف/يشيل
    setFav(isFav(bookId));   // يغير لون القلب فورًا
  };

  return (
    <div className="w-full flex gap-[24px] ">
      <img
        
           onTouchEnd={() => navigate(`/book/${book.documentId}`)}
  onClick={() => navigate(`/book/${book.documentId}`)}
        src={imgSrc}
        alt={book.title}
        className="cursor-pointer w-[173px] h-[253px] object-cover rounded-md bg-white relative z-10"
      />

      <div className="w-full flex flex-col gap-[24px]">
        <div className="w-full flex gap-[35px]">
          <div className="w-[424px] flex flex-col gap-[8px]">
            <h3 className="text-[16px] max-w-[182px] truncate text-[#222222] font-bold">
              {book.title}
            </h3>
            <p className="hidden lg:block w-full h-[88px] text-[14px] text-[#222222] font-normal">
              {book.description}
            </p>
          </div>

          <div className="w-[198px] h-[35px] border bg-[#FFFFFF] border-[#EBC305] rounded-xl flex justify-center items-center">
            <p className="text-[14px] font-[400] text-[#EBC305]">
              25% Discount code: {book.discountCode}
            </p>
          </div>
        </div>

        <div className="w-full flex gap-[215px]">
          <div className="w-[198px] flex flex-col gap-[16px]">
            <div className="w-full h-[35px] lg:h-[43px] flex flex-col gap-[8px]">
              <div className="w-full flex gap-[8px]">
                <div className="w-[116px]">
                  <RatingStars />
                </div>
                <p className="lg:text-[12px] text-[10px] font-semibold text-[#222222]">
                  ({book.reviewsCount} Review)
                </p>
              </div>

              <p className="hidden lg:block text-[14px] text-[#222222] font-semibold">
                <span className="font-light">Rate:</span> {book.rating}
              </p>
            </div>

            <div className="w-full flex gap-[40px]">
              <p className="flex flex-col text-[14px] text-[#222222] font-semibold">
                <span className="text-[14px] text-[#22222280]">Author</span>
                {book.author}
              </p>
              <p className="flex flex-col text-[14px] text-[#222222] font-semibold">
                <span className="text-[14px] text-[#22222280]">Year</span>
                {book.year}
              </p>
            </div>
          </div>

          <div className="w-[244px] flex flex-col gap-[24px]">
            <p className="lg:text-[26px] text-[18px] font-semibold text-[#222222]">
              $ {book.price}
            </p>

            <div className="w-full flex gap-[16px]">
<button
  className="btn w-[32px] h-[32px] flex items-center justify-center gap-[10px] lg:w-[180px] lg:h-[48px] bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold"
onClick={(e) => {
  e.stopPropagation(); // 🔥 مهم جدًا
  addToCart({ ...book, coverImageUrl: imgSrc });
}}
>
  Add To Cart
  <IoCartOutline className="text-lg" />
</button>

              {/* ✅ القلب بيتلون */}
              <button
                className="btn w-[32px] h-[32px] flex items-center justify-center lg:w-[48px] lg:h-[48px] bg-[#FFFFFF] rounded-lg border border-[#D9176C]"
               onClick={(e) => {
  e.stopPropagation(); // 🔥 مهم
  toggleFav(id);
  setFavState(prev => !prev);
}}
              >
                {fav ? (
                  <FaHeart className="text-lg text-[#D9176C]" />
                ) : (
                  <FaRegHeart className="text-lg text-[#D9176C]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}