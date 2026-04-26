import truck from '../assets/ShopAdvantages/truck.svg'
import creditCard from '../assets/ShopAdvantages/credit-card-buyer 1.svg'
import headset from '../assets/ShopAdvantages/user-headset 1.svg'
import restock from '../assets/ShopAdvantages/restock 1.svg'
import designBook from '../assets/SliderBooks/designbook.png'
import richDadBook from '../assets/LoginPage/richdadbook.png'
import { useEffect, useMemo, useRef, useState } from 'react'
import RatingStars from '../store/RatingStars'
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'
import api from "../api";
import { getBookImage } from "../utils/getBookCategoryImage";
import { addToCart, toggleFav, isFav } from "../utils/store";

export default function BeforeLogin() {
  const navigate = useNavigate();

  const ShopAdvantages = [
    {
      imgSrc: truck,
      header: 'Fast & Reliable Shipping',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'
    },
    {
      imgSrc: creditCard,
      header: 'Secure Payment',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'
    },
    {
      imgSrc: restock,
      header: 'Easy Returns',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'
    },
    {
      imgSrc: headset,
      header: '24/7 Customer Support',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'
    },
  ];

  const trackRef = useRef(null);
  const cardRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashIndex, setFlashIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [, setStorageTick] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: ""
  });

  const visibleCount = isDesktop ? 3 : 1;
  const flashVisibleCount = isDesktop ? 2 : 1;

  const FLASH_SALE_DURATION = 30 * 60 * 1000;
  const [flashSaleEndTime] = useState(() => Date.now() + FLASH_SALE_DURATION);
  const [timeLeft, setTimeLeft] = useState(FLASH_SALE_DURATION);

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getOriginalPrice = (book) => {
    const price = Number(book?.price || 0);
    const discountPercent = Number(book?.discountPercent || 0);

    if (!price) return 0;
    if (!discountPercent) return price;

    return price / (1 - discountPercent / 100);
  };

  const getBookPath = (book) => `/book/${book?.documentId ?? book?.id}`;

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
    const resolvedImage = getBookImage(book);

    return {
      ...book,
      image: resolvedImage,
      coverImageUrl: resolvedImage,
    };
  };

  const handleAddToCart = (e, book) => {
    e?.stopPropagation?.();
    if (loading || !book) return;

    addToCart(prepareBookForStorage(book));
    showToast("1 item added to cart");
    setStorageTick((prev) => prev + 1);
  };

  const handleToggleFav = (e, book) => {
    e?.stopPropagation?.();
    if (loading || !book) return;

    const updatedFav = toggleFav(book);
    const bookId = String(book?.documentId ?? book?.id ?? "");
    const nowFav = updatedFav.some((item) => String(item) === bookId);

    showToast(nowFav ? "1 item added to favourites" : "1 item removed from favourites");
    setStorageTick((prev) => prev + 1);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const calculateStep = () => {
      if (!cardRef.current) return;
      const cardWidth = cardRef.current.offsetWidth;
      const gap = isDesktop ? 32 : 16;
      setStep(cardWidth + gap);
    };

    calculateStep();
    window.addEventListener("resize", calculateStep);

    return () => window.removeEventListener("resize", calculateStep);
  }, [isDesktop, loading]);

  useEffect(() => {
    const syncStorageState = () => {
      setStorageTick((prev) => prev + 1);
    };

    window.addEventListener("storage-update", syncStorageState);
    window.addEventListener("storage", syncStorageState);

    return () => {
      window.removeEventListener("storage-update", syncStorageState);
      window.removeEventListener("storage", syncStorageState);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [visibleCount]);

  useEffect(() => {
    const fetchHomeBooks = async () => {
      try {
        setLoading(true);

        const params = {
          pagination: { page: 1, pageSize: 200 },
          fields: ["*"],
          populate: "*",
          sort: ["id:desc"],
        };

        const res = await api.get("/api/books", { params });

        console.log("HOME BOOKS API:", res.data);
        console.log("HOME FIRST BOOK:", res.data?.data?.[0]);

        const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
        setAllBooks(rows);
      } catch (err) {
        console.log("fetchHomeBooks error:", err.response?.data || err.message);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeBooks();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(flashSaleEndTime - Date.now(), 0);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleEndTime]);

  const bestSellerBooks = useMemo(() => {
    return [...allBooks]
      .filter((book) => book?.isActive !== false)
      .sort((a, b) => (b?.reviewsCount || 0) - (a?.reviewsCount || 0))
      .slice(0, 20);
  }, [allBooks]);

  const recommendedBooks = useMemo(() => {
    return [...allBooks]
      .filter((book) => book?.isActive !== false)
      .sort((a, b) => (b?.rating || 0) - (a?.rating || 0))
      .slice(0, 2);
  }, [allBooks]);

  const flashSaleBooks = useMemo(() => {
    return shuffleArray(
      allBooks.filter((book) => book?.isActive !== false)
    ).slice(0, 10);
  }, [allBooks]);

  const desktopAutoResetIndex = Math.max(bestSellerBooks.length - 7, 0);
  const desktopManualMaxIndex = Math.max(bestSellerBooks.length - 8, 0);

  const mobileAutoResetIndex = Math.max(bestSellerBooks.length - 3, 0);
  const mobileManualMaxIndex = Math.max(bestSellerBooks.length - 3, 0);

  const bestSellerAutoResetIndex = isDesktop
    ? desktopAutoResetIndex
    : mobileAutoResetIndex;

  const bestSellerManualMaxIndex = isDesktop
    ? desktopManualMaxIndex
    : mobileManualMaxIndex;

  const bestSellerCanAutoSlide = bestSellerAutoResetIndex > 0;
  const bestSellerCanManualSlide = bestSellerManualMaxIndex > 0;

  const displayBestSellerIndex = Math.min(index, bestSellerAutoResetIndex);
  const manualBestSellerIndex = Math.min(index, bestSellerManualMaxIndex);

  const isBestSellerAtStart = manualBestSellerIndex <= 0;
  const isBestSellerAtEnd = manualBestSellerIndex >= bestSellerManualMaxIndex;

  const flashMaxIndex = Math.max(flashSaleBooks.length - flashVisibleCount, 0);
  const isFlashAtStart = flashIndex === 0;
  const isFlashAtEnd = flashIndex >= flashMaxIndex;

  const flashSaleProgress = timeLeft / FLASH_SALE_DURATION;
  const flashSaleAngle = Math.max(0, Math.min(360, flashSaleProgress * 360));

  useEffect(() => {
    if (!bestSellerCanAutoSlide) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= bestSellerAutoResetIndex) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bestSellerCanAutoSlide, bestSellerAutoResetIndex]);

  useEffect(() => {
    if (index > bestSellerAutoResetIndex) {
      setIndex(bestSellerAutoResetIndex);
    }
  }, [bestSellerAutoResetIndex, index]);

  useEffect(() => {
    if (!flashSaleBooks.length) return;

    const interval = setInterval(() => {
      setFlashIndex((prev) => {
        if (prev >= flashMaxIndex) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [flashSaleBooks.length, flashMaxIndex]);

  const handleBestSellerPrev = () => {
    if (isBestSellerAtStart) return;
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleBestSellerNext = () => {
    if (isBestSellerAtEnd) return;
    setIndex((prev) => Math.min(prev + 1, bestSellerManualMaxIndex));
  };

  const BookImage = ({ book, fallback = richDadBook, className = "", alt = "" }) => (
    <img
      src={loading ? fallback : getBookImage(book)}
      alt={loading ? "loading" : alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = fallback;
      }}
    />
  );

  return (
    <div className="h-full w-full lg:max-w-full mx-auto gap-[40px] lg:gap-0 bg-[#F5F5F5] flex flex-col">
      {toast.show && (
        <div className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2 rounded-xl bg-[#222222] px-4 py-3 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          {toast.message}
        </div>
      )}

      <div className="hidden w-full h-dvh mb-[24px] lg:flex justify-center gap-[61px] items-center">
        {ShopAdvantages.map((el, idx) => (
          <div key={idx} className="w-[275px] flex flex-col gap-4">
            <img src={el.imgSrc} className='w-[30px]' alt="" />
            <h3 className='text-[#222222] text-[18px] font-bold'>{el.header}</h3>
            <p className='w-full text-[16px] font-normal text-[#8c8c8c]'>{el.details}</p>
          </div>
        ))}
      </div>

      {/* Best Seller */}
      <div className='w-full h-dvh flex flex-col justify-center items-center gap-[24px] lg:gap-[48px] bg-[#F5F5F5] lg:bg-[#3B2F4A]'>
        <div className='w-full lg:w-[516px] h-[87px] text-[#FFFFFF] flex items-center flex-col gap-[8px]'>
          <h3 className='self-center text-[#FFFFFF] text-[26px] font-bold'>
            Best Seller
          </h3>
          <p className='hidden lg:block w-full text-center text-[#ffffff80] text-[16px] font-normal'>
            Top 20 books with the highest number of reviews.
          </p>
        </div>

        <div className="w-full">
          <div className="w-full h-[300px] overflow-hidden">
            <div
              ref={trackRef}
              className="flex flex-nowrap h-full ease-in-out transition-transform duration-500"
              style={{
                transform: step ? `translateX(-${displayBestSellerIndex * step}px)` : "translateX(0)",
                gap: isDesktop ? "32px" : "16px",
              }}
            >
              {(loading ? Array(6).fill({}) : bestSellerBooks).map((book, i) => (
                <div
                  key={`${book?.documentId || book?.id || 'book'}-${i}`}
                  ref={i === 0 ? cardRef : null}
                  className="w-[140px] lg:w-[173px] h-full shrink-0 rounded-2xl overflow-hidden bg-white shadow cursor-pointer"
                  onClick={() => !loading && navigate(getBookPath(book))}
                >
                  <BookImage
                    book={book}
                    fallback={designBook}
                    alt={book?.title}
                    className="w-full h-[220px] object-cover"
                  />
                  <div className="p-2 bg-white">
                    <h4 className="text-[12px] lg:text-[14px] font-bold text-[#222] line-clamp-1">
                      {loading ? "Loading..." : book.title}
                    </h4>
                    <p className="text-[11px] text-[#666] line-clamp-1">
                      {loading ? "" : book.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              disabled={!bestSellerCanManualSlide || isBestSellerAtStart}
              onClick={handleBestSellerPrev}
              className={`w-10 h-10 lg:w-11 lg:h-11 text-black text-3xl rounded-full flex items-center justify-center transition ${
                !bestSellerCanManualSlide || isBestSellerAtStart
                  ? "bg-transparent opacity-40 cursor-default"
                  : "bg-white shadow cursor-pointer active:scale-95"
              }`}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              type="button"
              disabled={!bestSellerCanManualSlide || isBestSellerAtEnd}
              onClick={handleBestSellerNext}
              className={`w-10 h-10 lg:w-11 lg:h-11 text-black text-3xl rounded-full flex items-center justify-center transition ${
                !bestSellerCanManualSlide || isBestSellerAtEnd
                  ? "bg-transparent opacity-40 cursor-default"
                  : "bg-white shadow cursor-pointer active:scale-95"
              }`}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className='w-full lg:px-[60px] lg:py-[120px] h-full justify-center items-center flex flex-col gap-[32px] lg:gap-[40px]'>
        <div className='order-1 flex items-center justify-between gap-[16px] w-full px-[16px] lg:px-0'>
          <h2 className='text-[22px] lg:text-[26px] text-[#222222] font-bold leading-[1.2] whitespace-nowrap'>
            Recommended For You
          </h2>

          <Link
            to="/books"
            className="text-[16px] lg:hidden inline-flex items-center gap-[4px] px-[10px] py-[6px] text-[#D9176C] font-semibold whitespace-nowrap rounded-md"
          >
            See all
            <MdKeyboardArrowRight className='text-[20px]' />
          </Link>
        </div>

        <div className='order-2 overflow-x-auto px-[16px] w-full h-auto flex flex-col lg:flex-row gap-[16px] lg:gap-[24px]'>
          {(loading ? Array(2).fill({}) : recommendedBooks).map((book, idx) => {
            const favourite = !loading && isFav(book);

            return (
              <div
                key={book?.documentId || book?.id || idx}
                className='lg:w-full w-full min-h-[220px] p-[16px] lg:p-[40px] flex lg:gap-[39px] gap-[16px] justify-center items-center bg-white rounded-xl shadow'
              >
                <BookImage
                  book={book}
                  fallback={richDadBook}
                  alt={book?.title}
                  className='lg:w-[176px] w-[93px] h-[160px] lg:h-[240px] object-cover rounded-lg cursor-pointer shrink-0'
                />

                <div className='lg:w-[353px] w-[202px] h-full flex flex-col gap-[16px] lg:gap-[24px]'>
                  <div className='w-full flex flex-col lg:gap-[8px]'>
                    <div className='w-full flex flex-col gap-[4px]'>
                      <h3
                        className='text-[14px] lg:text-[18px] text-[#222222] font-bold cursor-pointer leading-[1.4]'
                        onClick={() => !loading && navigate(getBookPath(book))}
                      >
                        {loading ? "Loading..." : book.title}
                      </h3>
                      <h4 className='text-[10px] lg:text-[14px] font-semibold text-[#222222]'>
                        <span className='font-normal text-[#22222280]'>Author: </span>
                        {loading ? "" : book.author}
                      </h4>
                    </div>

                    <p className='hidden lg:block w-full text-[14px] text-[#222222] font-normal line-clamp-3'>
                      {loading ? "" : book.description}
                    </p>
                  </div>

                  <div className='w-full flex flex-wrap lg:flex-nowrap lg:flex-col lg:gap-[16px]'>
                    <div className='w-full flex flex-col lg:flex-row lg:items-start justify-between gap-[10px]'>
                      <div className='w-full flex flex-col gap-[8px]'>
                        <div className='w-full flex items-center gap-[12px] lg:gap-[16px] min-w-0'>
                          <div className='shrink-0 origin-left scale-[0.84] lg:scale-[0.9]'>
                            <RatingStars rating={loading ? 0 : (book.rating || 0)} />
                          </div>
                          <p className='text-[10px] lg:text-[12px] font-semibold text-[#222222] whitespace-nowrap'>
                            ({loading ? 0 : (book.reviewsCount || 0)} Review)
                          </p>
                        </div>

                        <p className='hidden lg:block text-[14px] text-[#222222] font-semibold'>
                          <span className='text-[#222222] font-light'>Rate:</span> {loading ? 0 : (book.rating || 0)}
                        </p>
                      </div>

                      <div className='w-full flex relative'>
                        <p className='lg:text-[26px] text-[18px] font-semibold text-[#222222]'>
                          ${loading ? 0 : (book.price || 0)}
                        </p>

                        <div className='lg:hidden absolute -top-2 right-0 self-end flex gap-[10px]'>
                          <button
                            onClick={(e) => handleAddToCart(e, book)}
                            className='w-[32px] h-[32px] flex items-center justify-center bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold shrink-0'
                          >
                            <IoCartOutline className='text-lg' />
                          </button>

                          <button
                            onClick={(e) => handleToggleFav(e, book)}
                            className={`w-[32px] h-[32px] flex items-center justify-center rounded-lg border shrink-0 ${
                              favourite
                                ? "bg-[#D9176C] border-[#D9176C] text-white"
                                : "bg-[#FFFFFF] border-[#D9176C] text-[#D9176C]"
                            }`}
                          >
                            {favourite ? <FaHeart className='text-base' /> : <FaRegHeart className='text-base' />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className='hidden lg:flex w-full self-end gap-[16px]'>
                      <button
                        onClick={(e) => handleAddToCart(e, book)}
                        className='btn w-[32px] h-[32px] lg:w-[289px] lg:h-[48px] bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold'
                      >
                        Add To Cart
                        <IoCartOutline />
                      </button>

                      <button
                        onClick={(e) => handleToggleFav(e, book)}
                        className={`btn w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] border ${
                          favourite
                            ? "bg-[#D9176C] border-[#D9176C] text-white"
                            : "bg-[#FFFFFF] border-[#D9176C] text-[#D9176C]"
                        }`}
                      >
                        {favourite ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flash Sale Desktop */}
      <div className='hidden lg:flex w-full flex-col px-[60px] py-[120px] gap-[48px] bg-[#F5F5F5]'>
        <div className='w-full flex items-start justify-between'>
          <div className='flex flex-col gap-[16px] max-w-[520px]'>
            <h2 className='text-[36px] leading-none font-bold text-[#222222]'>
              Flash Sale
            </h2>
            <p className='text-[16px] leading-[28px] text-[#22222280]'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et
              ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.
            </p>
          </div>

          <div className="relative w-[108px] h-[108px] shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #EC4899 0deg,
                  #EC4899 ${flashSaleAngle}deg,
                  #F7B7D4 ${flashSaleAngle}deg,
                  #F7B7D4 360deg
                )`,
                padding: "2px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div className="w-full h-full rounded-full bg-[#F5F5F5]" />
            </div>

            <div className="absolute inset-[4px] rounded-full border border-[#EC489980]"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[16px] font-bold text-[#222222] tracking-[0.5px]">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div
              className="absolute left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#EC4899] shadow"
              style={{ bottom: "-2px" }}
            />
          </div>
        </div>

        <div className='w-full flex items-center justify-center gap-[20px]'>
          <button
            type="button"
            disabled={isFlashAtStart}
            onClick={() => setFlashIndex((p) => Math.max(p - 1, 0))}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition ${
              isFlashAtStart ? "opacity-40 cursor-default" : "hover:scale-105 active:scale-95"
            }`}
          >
            <MdKeyboardArrowLeft className="text-[24px] text-[#BDBDBD]" />
          </button>

          <div className='w-[920px] overflow-hidden'>
            <div
              className='flex gap-[24px] transition-transform duration-500 ease-in-out'
              style={{
                transform: `translateX(-${flashIndex * 472}px)`,
              }}
            >
              {(loading ? Array(4).fill({}) : flashSaleBooks).map((book, idx) => {
                const favourite = !loading && isFav(book);

                return (
                  <div
                    key={book?.documentId || book?.id || idx}
                    className='w-[448px] h-[190px] shrink-0 rounded-[8px] bg-[#4B355D] px-[12px] py-[10px] flex gap-[12px]'
                  >
                    <BookImage
                      book={book}
                      fallback={richDadBook}
                      alt={book?.title}
                      className='w-[120px] h-[170px] object-cover rounded-[4px] bg-white'
                    />

                    <div className='flex-1 h-full flex flex-col justify-between pt-[4px]'>
                      <div className='flex flex-col gap-[8px]'>
                        <div>
                          <h3
                            className='text-[20px] leading-[1.2] font-bold text-white line-clamp-1 cursor-pointer'
                            onClick={() => !loading && navigate(getBookPath(book))}
                          >
                            {loading ? "Loading..." : book.title}
                          </h3>

                          <p className='text-[12px] text-[#FFFFFFB2] mt-[2px]'>
                            Author: {loading ? "" : book.author}
                          </p>
                        </div>

                        <div className='flex items-center gap-[8px]'>
                          <div className='w-[86px] shrink-0'>
                            <RatingStars rating={loading ? 0 : (book.rating || 0)} />
                          </div>
                          <p className='text-[12px] text-[#FFFFFFB2] whitespace-nowrap'>
                            ({loading ? 0 : (book.reviewsCount || 0)} Review)
                          </p>
                        </div>

                        <p className='text-[14px] text-white font-medium'>
                          <span className='text-[#FFFFFFB2] font-normal'>Rate:</span>{" "}
                          {loading ? 0 : (book.rating || 0)}
                        </p>
                      </div>

                      <div className='flex flex-col gap-[10px]'>
                        <div className='flex items-end gap-[8px]'>
                          <p className='text-[15px] text-[#FFFFFF66] line-through'>
                            ${loading ? "0.00" : getOriginalPrice(book).toFixed(2)}
                          </p>
                          <p className='text-[32px] leading-none font-bold text-white'>
                            ${loading ? "0.00" : Number(book.price || 0).toFixed(2)}
                          </p>
                        </div>

                        <div className='flex flex-col gap-[6px]'>
                          <div className='w-full h-[6px] rounded-full bg-[#6A5878] overflow-hidden'>
                            <div
                              className='h-full rounded-full bg-[#F0B356]'
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(12, ((book.reviewsCount || 0) % 100) || 12)
                                )}%`,
                              }}
                            />
                          </div>

                          <p className='text-[12px] text-[#FFFFFFB2]'>
                            4 books left
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='h-full flex items-end gap-[8px]'>
                      <button
                        onClick={(e) => handleAddToCart(e, book)}
                        className='w-[40px] h-[40px] rounded-[8px] bg-[#D9176C] flex items-center justify-center hover:scale-105 active:scale-95 transition'
                      >
                        <IoCartOutline className='text-white text-[18px]' />
                      </button>

                      <button
                        onClick={(e) => handleToggleFav(e, book)}
                        className={`w-[40px] h-[40px] rounded-[8px] border flex items-center justify-center transition ${
                          favourite
                            ? "bg-[#D9176C] border-[#D9176C] text-white"
                            : "bg-white border-[#D9176C] text-[#D9176C]"
                        }`}
                      >
                        {favourite ? <FaHeart className='text-[16px]' /> : <FaRegHeart className='text-[16px]' />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={isFlashAtEnd}
            onClick={() => setFlashIndex((p) => Math.min(p + 1, flashMaxIndex))}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition ${
              isFlashAtEnd ? "opacity-40 cursor-default" : "hover:scale-105 active:scale-95"
            }`}
          >
            <MdKeyboardArrowRight className="text-[24px] text-[#8E8E8E]" />
          </button>
        </div>
      </div>
    </div>
  )
}