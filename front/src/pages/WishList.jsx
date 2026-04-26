import { useEffect, useMemo, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaTimes, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getBookImage } from "../utils/getBookCategoryImage";
import {
  addToCart,
  getBookKey,
  getFav,
  getFavItems,
  removeFromFav,
} from "../utils/store";

export default function WishList() {
  const navigate = useNavigate();

  const [favIds, setFavIds] = useState(() => getFav());
  const [storedFavItems, setStoredFavItems] = useState(() => getFavItems());
  const [apiBooks, setApiBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 1800);
  };

  const refreshFavs = () => {
    setFavIds(getFav());
    setStoredFavItems(getFavItems());
  };

  useEffect(() => {
    const loadAllBooks = async () => {
      try {
        setLoading(true);

        let page = 1;
        let pageCount = 1;
        const all = [];

        do {
          const res = await api.get("/api/books", {
            params: {
              pagination: {
                page,
                pageSize: 100,
              },
              populate: "*",
              fields: ["*"],
            },
          });

          const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
          all.push(...rows);

          pageCount = Number(res?.data?.meta?.pagination?.pageCount || 1);
          page += 1;
        } while (page <= pageCount);

        setApiBooks(all);
      } catch (err) {
        console.log("wishlist load error:", err.response?.data || err.message);
        setApiBooks([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllBooks();
  }, []);

  useEffect(() => {
    const sync = () => refreshFavs();

    window.addEventListener("storage-update", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("storage-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const wishlistBooks = useMemo(() => {
    const apiMap = new Map();
    const storedMap = new Map();

    apiBooks.forEach((book) => {
      const key = getBookKey(book);
      if (key) apiMap.set(String(key), book);
    });

    storedFavItems.forEach((book) => {
      const key = getBookKey(book);
      if (key) storedMap.set(String(key), book);
    });

    return favIds
      .map((id) => {
        const key = String(id);
        return apiMap.get(key) || storedMap.get(key);
      })
      .filter(Boolean);
  }, [apiBooks, storedFavItems, favIds]);

  const handleRemove = (e, book) => {
    e.preventDefault();
    e.stopPropagation();

    const key = getBookKey(book);
    removeFromFav(key);

    refreshFavs();
    showToast("This item removed from favourites");
  };

  const handleMoveToCart = (e, book) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      ...book,
      image: getBookImage(book),
      coverImageUrl: getBookImage(book),
      imgSrc: getBookImage(book),
    });

    removeFromFav(getBookKey(book));
    refreshFavs();

    showToast("Moved to cart");
  };

  const getTitle = (book) => {
    return book?.title || book?.attributes?.title || "Untitled";
  };

  const getAuthor = (book) => {
    return book?.author || book?.attributes?.author || "Unknown author";
  };

  const getDescription = (book) => {
    return book?.description || book?.attributes?.description || "No description.";
  };

  const getPrice = (book) => {
    return Number(book?.price ?? book?.attributes?.price ?? 0);
  };

  if (loading && wishlistBooks.length === 0) {
    return (
      <div className="min-h-[60vh] w-full bg-[#F5F5F5] px-4 py-10 text-center text-[#22222280]">
        Loading wishlist...
      </div>
    );
  }

  if (wishlistBooks.length === 0) {
    return (
      <div className="min-h-[70vh] w-full bg-[#F5F5F5] px-4 py-12">
        <div className="mx-auto flex max-w-[520px] flex-col items-center rounded-[28px] border border-[#22222210] bg-white px-6 py-10 text-center shadow-sm">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#D9176C]/10">
            <FaHeart className="text-[26px] text-[#D9176C]" />
          </div>

          <h2 className="text-[28px] font-bold text-[#222222]">
            Your wish list is empty
          </h2>

          <p className="mt-3 max-w-[360px] text-[14px] leading-6 text-[#22222280]">
            Start adding your favourite books and they will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/books")}
            className="mt-7 h-12 rounded-2xl bg-[#D9176C] px-8 text-[15px] font-semibold text-white shadow-[0_12px_28px_rgba(217,23,108,0.25)] transition active:scale-95"
          >
            Keep Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[70vh] w-full bg-[#F5F5F5] px-4 py-6 lg:px-[60px] lg:py-[60px]">
      {toast && (
        <div className="fixed left-1/2 top-6 z-[999999] -translate-x-1/2 rounded-2xl bg-[#222222] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
          {toast}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#222222] lg:text-[36px]">
            My Wishlist
          </h1>

          <p className="mt-1 text-[14px] text-[#22222280]">
            {wishlistBooks.length} favourite item
            {wishlistBooks.length > 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/books")}
          className="hidden h-11 rounded-2xl border border-[#D9176C] bg-white px-5 text-[14px] font-semibold text-[#D9176C] lg:block"
        >
          Keep Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {wishlistBooks.map((book) => {
          const key = getBookKey(book);

          return (
            <div
              key={key}
              onClick={() => navigate(`/book/${key}`)}
              className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#22222210] bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(34,34,34,0.10)]"
            >
              <button
                type="button"
                onClick={(e) => handleRemove(e, book)}
                className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#D9176C] shadow-[0_8px_22px_rgba(34,34,34,0.14)] transition active:scale-95"
                aria-label="Remove from wishlist"
              >
                <FaTimes className="text-[14px]" />
              </button>

              <div className="flex gap-4">
                <img
                  src={getBookImage(book)}
                  alt={getTitle(book)}
                  className="h-[155px] w-[105px] shrink-0 rounded-2xl bg-[#EEE] object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="line-clamp-2 pr-8 text-[17px] font-bold text-[#222222]">
                    {getTitle(book)}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-[13px] text-[#22222280]">
                    {getAuthor(book)}
                  </p>

                  <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-[#22222280]">
                    {getDescription(book)}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <p className="text-[22px] font-bold text-[#222222]">
                      ${getPrice(book).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => handleMoveToCart(e, book)}
                      className="flex h-10 items-center gap-2 rounded-2xl bg-[#D9176C] px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(217,23,108,0.22)] transition active:scale-95"
                    >
                      <IoCartOutline className="text-[18px]" />
                      Move
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate("/books")}
        className="mt-6 h-12 w-full rounded-2xl border border-[#D9176C] bg-white text-[15px] font-semibold text-[#D9176C] lg:hidden"
      >
        Keep Shopping
      </button>
    </div>
  );
}