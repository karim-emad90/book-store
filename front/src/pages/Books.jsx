import { useEffect, useRef, useState } from "react";
import settings from "../assets/Books/settings-sliders (1) 1.png";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoMicOutline, IoSearchOutline } from "react-icons/io5";
import api from "../api";
import BookRow from "../components/BookRow";
import { useNavigate, useOutletContext } from "react-router-dom";
import MobileFooter from "../components/MobileFooter";
import { addToCart, toggleFav, isFav, isInCart } from "../utils/store";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import RatingStars from "../store/RatingStars";
import { getBookImage } from "../utils/getBookCategoryImage";
import {
  isLoggedInForFeatures,
  showLoginRequiredToast,
} from "../utils/featureGuard.jsx";

export default function Books() {
  const [toggleText, setToggleText] = useState("Load More");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [sort, setSort] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const { search, setSearch } = useOutletContext();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const [, setUiRefresh] = useState(0);

  const toastTimeoutRef = useRef(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const navigate = useNavigate();

  const toggleLoadMore = () => {
    setToggleText((prev) => (prev === "Load More" ? "Close" : "Load More"));
  };

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

  const prepareBookForStorage = (book) => {
    const image = getBookImage(book);

    return {
      ...book,
      image,
      coverImageUrl: image,
      imgSrc: image,
      coverImageFullUrl: image,
    };
  };

  const toggleCategory = (categoryDocumentId) => {
    setSelectedCategoryIds((prev) => {
      const exists = prev.includes(categoryDocumentId);
      return exists
        ? prev.filter((id) => id !== categoryDocumentId)
        : [...prev, categoryDocumentId];
    });

    setPage(1);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(
        "/api/categories?pagination[page]=1&pagination[pageSize]=200&fields[0]=name&fields[1]=slug&fields[2]=documentId&populate[books][fields][0]=documentId"
      );

      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      setCategories(rows);
    } catch (err) {
      console.log("fetchCategories error:", err.response?.data || err.message);
      setCategories([]);
    }
  };

  const fetchBooks = async () => {
    try {
      const term = debouncedSearch.trim();
      const hasCategory = selectedCategoryIds.length > 0;
      const hasSearch = term !== "";

      const params = {
        pagination: { page, pageSize },
        fields: ["*"],
        populate: "*",
        sort: sort ? [sort] : ["createdAt:desc"],
        filters: {
          coverImageUrl: { $notNull: true },
        },
      };

      const categoryFilter = hasCategory
        ? {
            $or: [
              { category: { $in: selectedCategoryIds } },
              { categories: { documentId: { $in: selectedCategoryIds } } },
            ],
          }
        : null;

      const searchFilter = hasSearch
        ? {
            $or: [
              { title: { $containsi: term } },
              { author: { $containsi: term } },
              { description: { $containsi: term } },
            ],
          }
        : null;

      if (categoryFilter && searchFilter) {
        params.filters = {
          coverImageUrl: { $notNull: true },
          $and: [categoryFilter, searchFilter],
        };
      } else if (categoryFilter) {
        params.filters = {
          coverImageUrl: { $notNull: true },
          ...categoryFilter,
        };
      } else if (searchFilter) {
        params.filters = {
          coverImageUrl: { $notNull: true },
          ...searchFilter,
        };
      }

      const res = await api.get("/api/books", { params });

      setBooks(Array.isArray(res?.data?.data) ? res.data.data : []);

      const meta = res.data?.meta?.pagination;
      setTotal(meta?.total ?? 0);
      setPageCount(meta?.pageCount ?? 1);
    } catch (err) {
      console.log("fetchBooks error:", err.response?.data || err.message);
      setBooks([]);
      setTotal(0);
      setPageCount(1);
    }
  };

const handleToggleFav = (book) => {
  if (!isLoggedInForFeatures()) {
    showLoginRequiredToast();
    return;
  }

  const wasFav = isFav(book);

  toggleFav({
    ...book,
    image: getBookImage(book),
    coverImageUrl: getBookImage(book),
    imgSrc: getBookImage(book),
  });

  showToast(
    wasFav
      ? "This item removed from favourites"
      : "This item added to favourites"
  );

  setUiRefresh((prev) => prev + 1);
};


  const handleAddToCart = (book) => {
  if (!isLoggedInForFeatures()) {
    showLoginRequiredToast();
    return;
  }

  addToCart(prepareBookForStorage(book));
  showToast("1 item added to cart");
  setUiRefresh((prev) => prev + 1);
};

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, selectedCategoryIds]);

  useEffect(() => {
    fetchBooks();
  }, [page, sort, debouncedSearch, selectedCategoryIds]);

  useEffect(() => {
    const onClick = (e) => {
      const target = e.target;
      if (!target.closest?.("[data-sort-wrapper='true']")) {
        setSortOpen(false);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const syncUi = () => {
      setUiRefresh((prev) => prev + 1);
    };

    window.addEventListener("storage-update", syncUi);
    window.addEventListener("storage", syncUi);

    return () => {
      window.removeEventListener("storage-update", syncUi);
      window.removeEventListener("storage", syncUi);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const getPageItems = (current, totalPages) => {
    if (totalPages <= 1) return [1];

    const pages = new Set();

    if (current > 1) pages.add(current - 1);
    pages.add(current);
    if (current < totalPages) pages.add(current + 1);

    const sortedPages = [...pages].sort((a, b) => a - b);

    if (sortedPages[sortedPages.length - 1] < totalPages) {
      sortedPages.push("...");
    }

    return sortedPages;
  };

  const pageItems = getPageItems(page, pageCount);

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const totalLabel = total > 5000 ? "5000+" : total.toLocaleString();

  return (
    <>
      {toast.show && (
        <div className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2 rounded-xl bg-[#222222] px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          {toast.message}
        </div>
      )}

      <div className="lg:hidden w-full bg-[#F5F5F5] px-4 pt-4 pb-8 flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          {(categories || []).slice(0, 7).map((cat) => {
            const active = selectedCategoryIds.includes(cat.documentId);

            return (
              <button
                key={cat.documentId}
                onClick={() => toggleCategory(cat.documentId)}
                className={`px-4 py-2 rounded-xl text-[14px] font-medium ${
                  active
                    ? "bg-[#D9176C] text-white"
                    : "bg-[#00000014] text-[#222222]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl border border-[#22222214] overflow-hidden">
            <button
              onClick={() => setMobileFilterOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <img src={settings} alt="filter" className="w-5 h-5" />
                <span className="text-[#222222] text-[16px] font-semibold">
                  Filters
                </span>
              </div>

              <IoIosArrowDown
                className={`text-[#22222280] text-xl transition-transform ${
                  mobileFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileFilterOpen && (
              <div className="px-4 pb-4 border-t border-[#22222210] flex flex-col gap-3">
                <button
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between pt-3"
                >
                  <span className="text-[15px] font-medium text-[#222222]">
                    Categories
                  </span>
                  <IoIosArrowDown
                    className={`text-[#22222280] text-lg transition-transform ${
                      mobileCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileCategoriesOpen && (
                  <div className="flex flex-col gap-3 pt-1">
                    {categories.map((el) => (
                      <label
                        key={el.documentId}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(el.documentId)}
                            onChange={() => toggleCategory(el.documentId)}
                          />
                          <span className="text-sm text-[#222222]">
                            {el.name}
                          </span>
                        </div>

                        <span className="text-sm text-[#22222280]">
                          ({el.books?.length || 0})
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <label className="block text-[15px] font-medium text-[#222222] mb-2">
                    Sort
                  </label>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#2222221A] bg-white px-3 text-sm text-[#222222] outline-none"
                  >
                    <option value="">Sort by</option>
                    <option value="price:asc">Price: Low → High</option>
                    <option value="price:desc">Price: High → Low</option>
                    <option value="rating:desc">Rating: High → Low</option>
                    <option value="reviewsCount:desc">
                      Reviews: High → Low
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {books.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-[#22222280] border border-[#22222210]">
              No books found for this filter.
            </div>
          ) : (
            books.map((book) => {
              const favActive = isFav(book?.documentId ?? book?.id);
              const inCart = isInCart(book?.documentId ?? book?.id);

              return (
                <div
                  key={book.documentId ?? book.id}
                  className="bg-white rounded-2xl p-3 border border-[#22222210] shadow-sm"
                >
                  <div
                    className="flex gap-3"
                    onClick={() => navigate(`/book/${book.documentId ?? book.id}`)}
                  >
                    <img
                      src={getBookImage(book)}
                      alt={book.title || "Book image"}
                      className="w-[105px] h-[320px] rounded-xl object-cover bg-[#D9F5FF] shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="text-[18px] font-semibold text-[#222222] truncate">
                        {book.title}
                      </h3>

                      <p className="mt-2 text-[14px] leading-6 text-[#222222CC] line-clamp-3">
                        {book.description ||
                          "Short description for the book appears here."}
                      </p>

                      <div className="mt-3 flex items-center gap-[8px] min-w-0">
                        <div className="shrink-0 origin-left scale-[0.82]">
                          <RatingStars rating={book.rating || 0} />
                        </div>
                        <span className="text-[12px] text-[#22222280] whitespace-nowrap">
                          ({book.reviewsCount || 0} Review)
                        </span>
                      </div>

                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[14px] text-[#22222280]">
                            Rate{" "}
                            <span className="text-[#222222]">
                              {book.rating || 3.9}
                            </span>
                          </p>

                          <div className="mt-2 text-[13px] text-[#22222280]">
                            Author
                          </div>
                          <div className="text-[14px] w-[60px] overflow-hidden text-[#222222] font-medium">
                            {book.author || "Unknown"}
                          </div>

                          <div className="mt-1 text-[13px] text-[#22222280]">
                            Year
                          </div>
                          <div className="text-[14px] text-[#222222] font-medium">
                            {book.year || "2000"}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 w-[124px] shrink-0">
                          <p className="text-[20px] font-semibold text-[#222222] w-full text-right">
                            ${book.price || 14.99}
                          </p>

                          <div
                            className="flex w-full items-center gap-2 justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleToggleFav(book)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition ${
                                favActive
                                  ? "bg-[#D9176C] border-[#D9176C]"
                                  : "bg-white border-[#D9176C]"
                              }`}
                            >
                              {favActive ? (
                                <FaHeart className="w-4 h-4 text-white" />
                              ) : (
                                <CiHeart className="w-5 h-5 text-[#D9176C]" />
                              )}
                            </button>

                            <button
                              className={`flex-1 h-10 min-w-0 px-2 rounded-xl text-[12px] font-medium whitespace-nowrap ${
                                inCart
                                  ? "bg-[#D9176C] text-white"
                                  : "bg-white text-[#D9176C] border border-[#D9176C]"
                              }`}
                              onClick={() => handleAddToCart(book)}
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <div className="px-4 h-10 rounded-2xl border border-[#E3C65C] text-[#D7B84A] text-sm flex items-center">
                      25% Discount code: {book.discountCode || "NE229"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div dir="ltr" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-[#D9176C] text-sm disabled:opacity-40"
            >
              ‹
            </button>

            {pageItems.map((it, idx) =>
              it === "..." ? (
                <span key={idx} className="px-2 text-[#22222280]">
                  ...
                </span>
              ) : (
                <button
                  key={`${it}-${idx}`}
                  onClick={() => setPage(it)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold ${
                    page === it
                      ? "bg-[#D9176C] text-white"
                      : "bg-white text-[#222222] border border-[#22222210]"
                  }`}
                >
                  {it}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="text-[#D9176C] text-sm disabled:opacity-40"
            >
              ›
            </button>
          </div>

          <p className="text-[12px] text-[#22222280]">
            {startItem}-{endItem} of {totalLabel} Book available
          </p>
        </div>

        <MobileFooter />
      </div>

      <div className="hidden lg:flex h-full w-full max-w-full mx-auto bg-[#F5F5F5]">
        <div className="w-[372px] pr-[16px] border-r border-[#2222221a] pl-[60px] pt-[60px] bg-[#F5F5F5] flex flex-col gap-[32px]">
          <div className="w-full flex gap-[4.5px] items-center">
            <img className="w-[24px] h-[24px]" src={settings} alt="" />
            <h4 className="text-[24px] text-[#222222] font-semibold">Filter</h4>
          </div>

          <div className="w-full h-full flex flex-col gap-[24px]">
            <div className="w-full flex flex-col p-[16px] gap-[8px] bg-[#FFFFFF]">
              <div
                className={`w-full gap-4 flex flex-col overflow-y-hidden ${
                  toggleText === "Load More" ? "h-[150px]" : "h-full"
                }`}
              >
                <div className="w-full items-center flex justify-between">
                  <h4 className="text-[#d9176c80]">Categories</h4>
                  <IoIosArrowDown className="text-[#d9176c80]" />
                </div>

                <div className="w-full flex flex-col gap-[10px]">
                  {categories.map((el) => {
                    return (
                      <div
                        key={el.documentId}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex gap-[8px] items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(el.documentId)}
                            onChange={() => toggleCategory(el.documentId)}
                            className="checkbox w-[16px] h-[16px]"
                          />
                          <h4 className="text-[14px] text-[#222222] font-normal">
                            {el.name}
                          </h4>
                        </div>

                        <h4 className="text-[14px] text-[#22222280] font-normal">
                          ({el.books?.length || 0})
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </div>

              <h4
                className="w-full hover:cursor-pointer flex justify-center text-[#D9176C] text-[14px] font-semibold"
                onClick={toggleLoadMore}
              >
                {toggleText}
              </h4>
            </div>

            <div className="w-full flex flex-col gap-[24px]">
              <div className="w-full p-[16px] flex justify-between items-center bg-[#FFFFFF]">
                <h4 className="text-[18px] font-semibold text-[#222222]">
                  Publisher
                </h4>
                <MdKeyboardArrowRight className="w-[24px] h-[24px] text-[#222222]" />
              </div>

              <div className="w-full p-[16px] flex justify-between items-center bg-[#FFFFFF]">
                <h4 className="text-[18px] font-semibold text-[#222222]">
                  Year
                </h4>
                <MdKeyboardArrowRight className="w-[24px] h-[24px] text-[#222222]" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-[40px] h-full pl-[24px] pr-[60px] pb-[97px] pt-[60px] bg-[#F5F5F5]">
          <div className="w-full flex flex-col gap-[24px] pr-[60px] h-[150px]">
            <div className="w-full flex justify-between items-center gap-5">
              <div className="w-full h-[59px] flex">
                <div className="relative">
                  <input
                    type="text"
                    className="outline-0 w-[688px] h-full pl-[24px] text-black text-[18px] bg-[#FFFFFF] rounded-l-4xl rounded-r-none border-[#22222233] placeholder:text-[20px] placeholder:text-[#22222280]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title or author..."
                  />
                  <IoMicOutline className="absolute right-[17.5px] top-[17.5px] text-2xl text-[#22222280]" />
                </div>

                <button
                  type="button"
                  onClick={() => setDebouncedSearch(search.trim())}
                  className="bg-[#FFFFFF] rounded-r-4xl w-[70px] border border-l-[#22222280] h-full flex justify-center items-center"
                >
                  <IoSearchOutline className="text-2xl text-[#D9176C]" />
                </button>
              </div>

              <div
                data-sort-wrapper="true"
                className="w-full h-[45px] relative max-w-[260px]"
              >
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="w-full rounded-xl h-full text-[#22222280] bg-[#0000001a] flex items-center justify-between px-[16px]"
                >
                  <span>
                    {sort === ""
                      ? "Sort by"
                      : sort === "price:asc"
                      ? "Price: Low → High"
                      : sort === "price:desc"
                      ? "Price: High → Low"
                      : sort === "rating:desc"
                      ? "Rating: High → Low"
                      : "Reviews: High → Low"}
                  </span>

                  <MdKeyboardArrowRight
                    className={`w-[24px] h-[24px] text-xl text-[#22222280] transition-transform ${
                      sortOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-[52px] w-full bg-white rounded-xl shadow-lg border border-[#2222221a] overflow-hidden z-50">
                    <button
                      className="w-full text-left px-4 py-3 text-[14px] text-neutral-800 hover:bg-[#D9176C0D]"
                      onClick={() => {
                        setSort("price:asc");
                        setSortOpen(false);
                      }}
                    >
                      Price: Low → High
                    </button>

                    <button
                      className="w-full text-left px-4 py-3 text-[14px] text-neutral-800 hover:bg-[#D9176C0D]"
                      onClick={() => {
                        setSort("price:desc");
                        setSortOpen(false);
                      }}
                    >
                      Price: High → Low
                    </button>

                    <button
                      className="w-full text-left px-4 py-3 text-[14px] text-neutral-800 hover:bg-[#D9176C0D]"
                      onClick={() => {
                        setSort("rating:desc");
                        setSortOpen(false);
                      }}
                    >
                      Rating: High → Low
                    </button>

                    <button
                      className="w-full text-left px-4 py-3 text-[14px] text-neutral-800 hover:bg-[#D9176C0D]"
                      onClick={() => {
                        setSort("reviewsCount:desc");
                        setSortOpen(false);
                      }}
                    >
                      Reviews: High → Low
                    </button>

                    <button
                      className="w-full text-left px-4 py-3 text-[14px] text-[#D9176C] hover:bg-[#D9176C0D]"
                      onClick={() => {
                        setSort("");
                        setSortOpen(false);
                      }}
                    >
                      Clear sort
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex gap-[12px] flex-wrap">
              {(categories || []).slice(0, 8).map((cat) => {
                const active = selectedCategoryIds.includes(cat.documentId);

                return (
                  <button
                    key={cat.documentId}
                    onClick={() => toggleCategory(cat.documentId)}
                    className={`w-[114px] h-[42px] rounded-xl flex justify-center items-center text-[16px] transition-all duration-200 ${
                      active
                        ? "bg-[#d9176c80] text-white"
                        : "bg-[#00000033] text-[#222222]"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-[881px] flex flex-col gap-[60px] bg-[#F5F5F5]">
            {books.length === 0 ? (
              <div className="w-full bg-white rounded-2xl p-8 text-center text-[#22222280] border border-[#22222210]">
                No books found for this filter.
              </div>
            ) : (
              books.map((book) => {
                const imgSrc = getBookImage(book);
                return (
                  <BookRow
                    key={book.documentId ?? book.id}
                    book={book}
                    imgSrc={imgSrc}
                  />
                );
              })
            )}

            <div className="w-full flex flex-col items-center gap-2 mt-8">
              <div dir="ltr" className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`flex items-center gap-2 text-[14px] font-medium ${
                    page === 1
                      ? "text-[#D9176C80] cursor-not-allowed"
                      : "text-[#D9176C]"
                  }`}
                >
                  <span className="text-[18px] leading-none">‹</span>
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {pageItems.map((it, idx) => {
                    if (it === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="px-2 text-[#22222280]"
                        >
                          ...
                        </span>
                      );
                    }

                    const active = it === page;

                    return (
                      <button
                        key={it}
                        onClick={() => setPage(it)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-semibold ${
                          active
                            ? "bg-[#D9176C] text-white"
                            : "bg-white text-[#222222]"
                        }`}
                      >
                        {it}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className={`flex items-center gap-2 text-[14px] font-medium ${
                    page === pageCount
                      ? "text-[#D9176C80] cursor-not-allowed"
                      : "text-[#D9176C]"
                  }`}
                >
                  Next
                  <span className="text-[18px] leading-none">›</span>
                </button>
              </div>

              <p className="text-[13px] text-[#22222280]">
                {startItem}-{endItem} of {totalLabel} Book available
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}