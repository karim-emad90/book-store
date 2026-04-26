import { useEffect, useRef, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import RatingStars from "../store/RatingStars";
import { addToCart, toggleFav, isFav, isInCart } from "../utils/store";
import { useNavigate } from "react-router-dom";
import { getBookImage } from "../utils/getBookCategoryImage";

export default function BookRow({ book, imgSrc }) {
  const bookId = book.documentId ?? book.id;
  const navigate = useNavigate();

  const [fav, setFav] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const syncState = async () => {
      try {
        const favState = await isFav(bookId);
        const cartState = await isInCart(bookId);

        setFav(!!favState);
        setInCart(!!cartState);
      } catch (error) {
        console.error("BookRow sync error:", error);
      }
    };

    syncState();

    const update = () => {
      syncState();
    };

    window.addEventListener("storage-update", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("storage-update", update);
      window.removeEventListener("storage", update);
    };
  }, [bookId]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({
      show: true,
      message,
    });

    toastTimeoutRef.current = setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 1800);
  };

  const onToggleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const updatedFav = await toggleFav(bookId);
      const nowFav =
        Array.isArray(updatedFav) &&
        updatedFav.some((item) => String(item) === String(bookId));

      setFav(nowFav);

      showToast(
        nowFav
          ? "1 item added to favourites"
          : "This item removed from favourites"
      );
    } catch (error) {
      console.error("toggleFav error:", error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const image = imgSrc || getBookImage(book);

      await addToCart({
        ...book,
        image,
        imgSrc: image,
        coverImageUrl: image,
        coverImageFullUrl: image,
      });

      setInCart(true);
      showToast("1 item added to cart");
    } catch (error) {
      console.error("addToCart error:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/book/${book.documentId}`);
  };

  return (
    <>
      {toast.show && (
        <div className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2 rounded-xl bg-[#222222] px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          {toast.message}
        </div>
      )}

      <div className="w-full flex gap-[24px]">
        <img
          onClick={handleNavigate}
          src={imgSrc || getBookImage(book)}
          alt={book.title}
          className="cursor-pointer w-[173px] h-[253px] object-cover rounded-md bg-white relative z-10"
        />

        <div className="w-full flex flex-col gap-[24px]">
          <div
            className="w-full flex gap-[35px] cursor-pointer"
            onClick={handleNavigate}
          >
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
            <div
              className="w-[198px] flex flex-col gap-[16px] cursor-pointer"
              onClick={handleNavigate}
            >
              <div className="w-full h-[35px] lg:h-[43px] flex flex-col gap-[8px]">
                <div className="w-full flex items-center gap-[8px] min-w-0">
                  <div className="w-[116px] shrink-0 origin-left scale-[0.88]">
                    <RatingStars rating={book.rating} />
                  </div>
                  <p className="lg:text-[12px] text-[10px] font-semibold text-[#222222] whitespace-nowrap">
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
                  className={`btn w-[32px] h-[32px] flex items-center justify-center gap-[10px] lg:w-[180px] lg:h-[48px] rounded-lg text-[16px] font-semibold ${
                    inCart
                      ? "bg-[#D9176C] text-white"
                      : "bg-white text-[#D9176C] border border-[#D9176C]"
                  }`}
                  onClick={handleAddToCart}
                >
                  Add To Cart
                  <IoCartOutline className="text-lg" />
                </button>

                <button
                  className="btn w-[32px] h-[32px] flex items-center justify-center lg:w-[48px] lg:h-[48px] bg-[#FFFFFF] rounded-lg border border-[#D9176C]"
                  onClick={onToggleFav}
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
    </>
  );
}