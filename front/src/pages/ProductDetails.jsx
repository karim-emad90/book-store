import richDadBook from "../assets/LoginPage/richdadbook.png";
import fb from "../assets/ProductDetails/fb.png";
import insta from "../assets/ProductDetails/insta.png";
import twiteer from "../assets/ProductDetails/x.png";
import whats from "../assets/ProductDetails/whats.png";
import RatingStars from "../store/RatingStars";
import badgeCheck from "../assets/ProductDetails/badge-check (1) 1.png";
import shippingVan from "../assets/ProductDetails/shipping-fast 1 (1).png";
import cart from "../assets/ProductDetails/Vector (2).png";

import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { addToCart, toggleFav, isFav } from "../utils/store";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import MobileFooter from "../components/MobileFooter";
import { getBookImage } from "../utils/getBookCategoryImage";
import {
  isLoggedInForFeatures,
  showLoginRequiredToast,
} from "../utils/featureGuard.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [qty, setQty] = useState(1);
  const [favState, setFavState] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    setFavState(isFav(id));
  }, [id]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get("/api/books", {
          params: {
            "filters[documentId][$eq]": id,
            populate: "*",
          },
        });

        setBook(res?.data?.data?.[0] || null);
      } catch (err) {
        console.log("ProductDetails error:", err.response?.data || err.message);
        setBook(null);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const fixedBook = {
    ...book,
    id: book.documentId ?? book.id,
    image: getBookImage(book),
    imgSrc: getBookImage(book),
    coverImageFullUrl: getBookImage(book),
  };

  return (
    <div className="w-full h-full flex flex-col gap-[70px] p-[60px] max-md:gap-[30px] max-md:p-[16px]">
      <div className="w-full flex gap-[24px] max-md:flex-col max-md:gap-[20px]">
        <img
          src={getBookImage(book)}
          className="lg:w-[312px] lg:h-[456px] w-full h-[350px] object-cover"
          alt={book.title || "Book image"}
        />

        <div className="w-full flex flex-col gap-[40px] max-md:gap-[20px]">
          <div className="w-full h-[237px] flex flex-col gap-[24px] max-md:h-auto max-md:gap-[16px]">
            <div className="w-full flex gap-[38px] max-md:flex-col max-md:gap-[16px]">
              <div className="w-[758px] flex flex-col gap-[8px] max-md:w-full">
                <h3 className="text-[28px] text-[#222222] font-bold max-md:text-[20px]">
                  {book.title}
                </h3>

                <p className="text-[18px] text-[#22222280] max-md:text-[14px]">
                  {book.description}
                </p>
              </div>

              <div className="w-[188px] flex gap-[12px] max-md:hidden">
                <img className="w-[30px] h-[30px]" src={fb} alt="" />
                <img className="w-[30px] h-[30px]" src={insta} alt="" />
                <img className="w-[30px] h-[30px]" src={twiteer} alt="" />
                <img className="w-[30px] h-[30px]" src={whats} alt="" />
              </div>
            </div>

            <div className="w-full flex gap-[24px] max-md:flex-wrap max-md:gap-[16px]">
              <Info label="Author" value={book.author} />
              <Info label="Publication Year" value={book.year} />
              <Info label="Book" value="1 Of 1" />
              <Info label="Pages" value={book.pages} />
              <Info label="Language" value={book.language} />
            </div>
          </div>

          <div className="w-full flex justify-between max-md:flex-col max-md:gap-[20px]">
            <div className="w-[241px] flex flex-col gap-[16px]">
              <div className="flex gap-[8px]">
                <RatingStars rating={book.rating} />
                <p className="text-[16px] text-[#00000080]">
                  ({book.reviewsCount || 0} Review)
                </p>
              </div>

              <p className="text-[18px] text-[#00000080]">
                Rate:{" "}
                <span className="font-semibold text-[#222222]">
                  {book.rating || 0}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-[12px]">
              <button className="flex items-center gap-[5px] border rounded-xl px-3 py-1 text-[#25D994]">
                <img src={badgeCheck} alt="" />
                In Stock
              </button>

              <button className="flex items-center gap-[5px] border rounded-xl px-3 py-1 text-[#22222280]">
                <img src={shippingVan} alt="" />
                Free Shipping Today
              </button>

              <button className="border rounded-xl px-3 py-1 text-[#EAA451]">
                Discount code: {book.discountCode}
              </button>
            </div>
          </div>

          <div className="w-full flex items-start justify-between max-md:flex-col max-md:gap-[20px]">
            <div className="w-[205px] flex gap-[16px] items-center">
              <p className="text-[36px] text-[#222222] font-semibold max-md:text-[24px]">
                ${book.price}
              </p>

              <p className="text-[24px] text-[#22222280] line-through max-md:text-[16px]">
                $40.00
              </p>
            </div>

            <div className="w-[398px] h-[48px] flex gap-[40px] max-md:w-full max-md:flex-col max-md:h-auto max-md:gap-[16px]">
              <div className="flex justify-center items-center gap-[8.5px]">
                <button
                  className="w-[24px] h-[24px] rounded-full border-2 border-[#D9176C] text-[#D9176C]"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>

                <p className="text-[30px] font-semibold text-[#222222]">
                  {qty}
                </p>

                <button
                  className="w-[24px] h-[24px] rounded-full border-2 border-[#D9176C] text-[#D9176C]"
                  onClick={() => setQty((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="w-[244px] h-[50px] lg:h-full flex gap-[16px] max-md:w-full">
                <button
                  className="w-[180px] h-full bg-[#D9176C] text-white rounded-xl flex justify-center items-center gap-[10px] max-md:flex-1"
                 onClick={() => {
  if (!isLoggedInForFeatures()) {
    showLoginRequiredToast();
    return;
  }

  for (let i = 0; i < qty; i += 1) {
    addToCart(fixedBook);
  }
}}
                >
                  Add To Cart
                  <img src={cart} alt="" />
                </button>

                <button
                  className="w-[48px] h-full border border-[#D9176C] rounded-xl flex justify-center items-center"
                 onClick={() => {
  if (!isLoggedInForFeatures()) {
    showLoginRequiredToast();
    return;
  }

  const wasFav = isFav(fixedBook);

  toggleFav({
    ...fixedBook,
    image: getBookImage(fixedBook),
    coverImageUrl: getBookImage(fixedBook),
    imgSrc: getBookImage(fixedBook),
  });

  setFavState(!wasFav);
}}
                >
                  {favState ? (
                    <FaHeart className="text-[#D9176C]" />
                  ) : (
                    <FaRegHeart className="text-[#D9176C]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="flex gap-8 border-b border-gray-300 mb-6 max-md:gap-4 max-md:overflow-x-auto">
          {["details", "reviews", "recommended"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-bold text-sm ${
                activeTab === tab
                  ? "text-black border-b-2 border-orange-400"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="pt-2 h-[200px]">
          {activeTab === "details" && (
            <>
              <p className="text-gray-700">
                <b className="text-l text-[#222222] font-semibold">Book Title:</b>{" "}
                {book.title}
              </p>
              <p className="text-gray-700">
                <b className="text-l text-[#222222] font-semibold">Author:</b>{" "}
                {book.author}
              </p>
              <p className="text-gray-700">
                <b className="text-l text-[#222222] font-semibold">Publication Date:</b>{" "}
                {book.year}
              </p>
              <p className="text-gray-700">
                <b className="text-l text-[#222222] font-semibold">Language:</b>{" "}
                {book.language}
              </p>
              <p className="text-gray-700">
                <b className="text-l text-[#222222] font-semibold">Pages:</b>{" "}
                {book.pages}
              </p>
              <p className="text-gray-700">
                <b className="text-l text-[#222222] font-semibold">Format:</b>{" "}
                Hard Cover
              </p>
            </>
          )}
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col gap-[4px] min-w-[80px]">
      <h4 className="text-[16px] text-[#22222280]">{label}</h4>
      <p className="text-[14px] font-semibold text-[#222222]">{value}</p>
    </div>
  );
}