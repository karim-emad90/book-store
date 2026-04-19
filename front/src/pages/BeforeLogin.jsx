import truck from '../assets/ShopAdvantages/truck.svg'
import creditCard from '../assets/ShopAdvantages/credit-card-buyer 1.svg'
import headset from '../assets/ShopAdvantages/user-headset 1.svg'
import restock from '../assets/ShopAdvantages/restock 1.svg'
import designBook from '../assets/SliderBooks/designbook.png'
import richDadBook from '../assets/LoginPage/richdadbook.png'
import { useEffect, useMemo, useRef, useState } from 'react'
import RatingStars from '../store/RatingStars'
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'
import api from "../api";
import { getBookImage } from "../utils/getBookCategoryImage";

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

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [flashIndex, setFlashIndex] = useState(0);

  const visibleCount =
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : 1;

  const flashVisibleCount =
    typeof window !== "undefined" && window.innerWidth >= 1024 ? 2 : 1;

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    const calculateStep = () => {
      if (!cardRef.current) return;
      const cardWidth = cardRef.current.offsetWidth;
      const gap = window.innerWidth >= 1024 ? 32 : 16;
      setStep(cardWidth + gap);
    };

    calculateStep();
    window.addEventListener("resize", calculateStep);

    return () => window.removeEventListener("resize", calculateStep);
  }, []);

  useEffect(() => {
    const fetchHomeBooks = async () => {
      try {
        setLoading(true);

        const params = {
          pagination: { page: 1, pageSize: 200 },
          fields: ["*"],
          populate: "*",
          sort: ["id:desc"],
          filters: {
            coverImageUrl: { $notNull: true },
          },
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

  const isAtEnd = index >= Math.max(bestSellerBooks.length - visibleCount, 0);
  const isAtStart = index === 0;
  const maxIndex = Math.max(bestSellerBooks.length - visibleCount, 0);

  const flashMaxIndex = Math.max(flashSaleBooks.length - flashVisibleCount, 0);
  const isFlashAtStart = flashIndex === 0;
  const isFlashAtEnd = flashIndex >= flashMaxIndex;

  useEffect(() => {
    if (!bestSellerBooks.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bestSellerBooks.length, maxIndex]);

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
      <div className="hidden w-full h-dvh mb-[24px] lg:flex justify-center gap-[61px] items-center">
        {ShopAdvantages.map((el, index) => (
          <div key={index} className="w-[275px] flex flex-col gap-4">
            <img src={el.imgSrc} className='w-[30px]' alt="" />
            <h3 className='text-[#222222] text-[18px] font-bold'>{el.header}</h3>
            <p className='w-full text-[16px] font-normal text-[#8c8c8c]'>{el.details}</p>
          </div>
        ))}
      </div>

      {/* Best Seller */}
      <div className='w-full h-dvh flex flex-col justify-center items-center gap-[24px] lg:gap-[80px] bg-[#F5F5F5] lg:bg-[#3B2F4A]'>
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
              className="flex flex-nowrap h-full transition-transform duration-500 ease-in-out"
              style={{
                transform: step ? `translateX(-${index * step}px)` : "translateX(0)",
                gap: typeof window !== "undefined" && window.innerWidth >= 1024 ? "32px" : "16px",
              }}
            >
              {(loading ? Array(6).fill({}) : bestSellerBooks).map((book, i) => (
                <div
                  key={book?.documentId || book?.id || i}
                  ref={i === 0 ? cardRef : null}
                  className="w-[140px] lg:w-[173px] h-full shrink-0 rounded-2xl overflow-hidden bg-white shadow cursor-pointer"
                  onClick={() => !loading && navigate(`/book/${book.documentId}`)}
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

          <div className="flex justify-center gap-4 mt-4 lg:hidden">
            <button
              type="button"
              disabled={isAtStart}
              onClick={() => setIndex((p) => Math.max(p - 1, 0))}
              className={`w-10 h-10 text-black text-3xl rounded-full flex items-center justify-center ${
                isAtStart
                  ? "bg-transparent opacity-40 cursor-default text-black"
                  : "bg-white shadow cursor-pointer active:scale-95"
              }`}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              type="button"
              disabled={isAtEnd}
              onClick={() => setIndex((p) => Math.min(p + 1, maxIndex))}
              className={`w-10 h-10 text-black text-3xl rounded-full flex items-center justify-center ${
                isAtEnd
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
      <div className='w-full lg:px-[60px] lg:py-[120px] h-full justify-center items-center flex flex-col gap-[40px]'>
        <div className='order-1 flex gap-[116px] w-full'>
          <h2 className='text-[15px] w-[161px] lg:w-fit lg:text-[26px] text-[#222222] font-bold'>
            Recomended For You
          </h2>

          <Link to="/books" className="text-[16px] lg:hidden flex items-center w-[70px] lg:w-fit text-[#D9176C] font-semibold">
            See all
            <MdKeyboardArrowRight className='w-[18px] text-xl' />
          </Link>
        </div>

        <div className='order-2 overflow-x-auto px-[16px] w-full h-auto flex flex-col lg:flex-row gap-[16px] lg:gap-[24px]'>
          {(loading ? Array(2).fill({}) : recommendedBooks).map((book, idx) => (
            <div
              key={book?.documentId || book?.id || idx}
              className='lg:w-full w-full min-h-[220px] p-[16px] lg:p-[40px] flex lg:gap-[39px] gap-[16px] justify-center items-center bg-white rounded-xl shadow'
            >
              <BookImage
                book={book}
                fallback={richDadBook}
                alt={book?.title}
                className='lg:w-[176px] w-[93px] h-[160px] lg:h-[240px] object-cover rounded-lg cursor-pointer'
              />

              <div className='lg:w-[353px] w-[202px] h-full flex flex-col gap-[16px] lg:gap-[24px]'>
                <div className='w-full flex flex-col lg:gap-[8px]'>
                  <div className='w-full flex flex-col lg:gap-[4px]'>
                    <h3
                      className='lg:text-[18px] text-[10px] text-[#222222] font-bold cursor-pointer'
                      onClick={() => !loading && navigate(`/book/${book.documentId}`)}
                    >
                      {loading ? "Loading..." : book.title}
                    </h3>
                    <h4 className='lg:text-[14px] text-[10px] font-semibold text-[#222222]'>
                      <span className='lg:text-[14px] text-[10px] font-normal text-[#22222280]'>Author: </span>
                      {loading ? "" : book.author}
                    </h4>
                  </div>

                  <p className='hidden lg:block w-full text-[14px] text-[#222222] font-normal line-clamp-3'>
                    {loading ? "" : book.description}
                  </p>
                </div>

                <div className='w-full flex flex-wrap lg:flex-nowrap lg:flex-col lg:gap-[16px]'>
                  <div className='w-full flex flex-col lg:flex-row justify-between'>
                    <div className='w-full h-[35px] lg:h-[43px] flex flex-col gap-[8px]'>
                      <div className='w-full flex gap-[8px]'>
                        <div className='lg:w-[96px] w-[74px]'>
                          <RatingStars rating={loading ? 0 : (book.rating || 0)} />
                        </div>
                        <p className='lg:text-[12px] text-[10px] font-semibold text-[#222222]'>
                          ({loading ? 0 : (book.reviewsCount || 0)} Review)
                        </p>
                      </div>

                      <p className='hidden lg:block text-[14px] text-[#222222] font-semibold'>
                        <span className='text-[14px] text-[#222222] font-light'>Rate:</span> {loading ? 0 : (book.rating || 0)}
                      </p>
                    </div>

                    <div className='w-full flex relative'>
                      <p className='lg:text-[26px] text-[18px] font-semibold text-[#222222]'>
                        ${loading ? 0 : (book.price || 0)}
                      </p>

                      <div className='lg:hidden absolute -top-2 left-27 w-full self-end flex gap-[10px]'>
                        <button className='w-[32px] h-[32px] flex items-center justify-center lg:w-[289px] lg:h-[48px] bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold'>
                          <IoCartOutline className='text-lg' />
                        </button>

                        <button className='w-[32px] h-[32px] flex items-center justify-center lg:w-[48px] lg:h-[48px] bg-[#FFFFFF] rounded-lg border border-[#D9176C] text-[#D9176C]'>
                          <FaRegHeart className='text-lg' />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='hidden lg:flex w-full self-end gap-[16px]'>
                    <button className='btn w-[32px] h-[32px] lg:w-[289px] lg:h-[48px] bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold'>
                      Add To Cart
                      <IoCartOutline />
                    </button>

                    <button className='btn w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] bg-[#FFFFFF] border border-[#D9176C] text-[#D9176C]'>
                      <FaRegHeart />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      <div className='w-full lg:px-[60px] lg:py-[120px] h-full justify-center items-center flex flex-col gap-[40px]'>
        <div className='w-full flex items-center justify-between'>
          <h2 className='text-[26px] text-[#222222] font-bold'>Flash Sale</h2>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={isFlashAtStart}
              onClick={() => setFlashIndex((p) => Math.max(p - 1, 0))}
              className={`w-10 h-10 text-black text-3xl rounded-full flex items-center justify-center ${
                isFlashAtStart
                  ? "bg-transparent opacity-40 cursor-default"
                  : "bg-white shadow cursor-pointer active:scale-95"
              }`}
            >
              <MdKeyboardArrowLeft />
            </button>

            <button
              type="button"
              disabled={isFlashAtEnd}
              onClick={() => setFlashIndex((p) => Math.min(p + 1, flashMaxIndex))}
              className={`w-10 h-10 text-black text-3xl rounded-full flex items-center justify-center ${
                isFlashAtEnd
                  ? "bg-transparent opacity-40 cursor-default"
                  : "bg-white shadow cursor-pointer active:scale-95"
              }`}
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>

        <div className='w-full overflow-hidden px-[16px]'>
          <div
            className='flex gap-[24px] transition-transform duration-500 ease-in-out'
            style={{
              transform: `translateX(-${flashIndex * (typeof window !== "undefined" && window.innerWidth >= 1024 ? 344 : 284)}px)`
            }}
          >
            {(loading ? Array(4).fill({}) : flashSaleBooks).map((book, idx) => (
              <div
                key={book?.documentId || book?.id || idx}
                className='min-w-[260px] lg:min-w-[320px] p-[16px] bg-[#3B2F4A] rounded-lg flex gap-[16px] shrink-0'
              >
                <BookImage
                  book={book}
                  fallback={richDadBook}
                  alt={book?.title}
                  className='w-[100px] lg:w-[140px] h-[150px] lg:h-[200px] object-cover rounded-lg cursor-pointer'
                />

                <div className='flex-1 flex flex-col gap-[12px]'>
                  <h3
                    className='text-[16px] text-white font-bold line-clamp-2 cursor-pointer'
                    onClick={() => !loading && navigate(`/book/${book.documentId}`)}
                  >
                    {loading ? "Loading..." : book.title}
                  </h3>

                  <p className='text-[12px] text-[#ffffffcc]'>
                    <span className='text-[#ffffff80]'>Author:</span> {loading ? "" : book.author}
                  </p>

                  <p className='text-[18px] text-white font-semibold'>
                    ${loading ? 0 : (book.price || 0)}
                  </p>

                  <p className='text-[12px] text-[#ffffff80]'>
                    Discount: {loading ? 0 : (book.discountPercent || 0)}%
                  </p>

                  <button className='btn w-[52px] border-0 h-[48px] self-end bg-[#D9176C]'>
                    <IoCartOutline />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}