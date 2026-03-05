import { useEffect, useState } from 'react';
import settings from '../assets/Books/settings-sliders (1) 1.png';
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoCartOutline, IoMicOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegHeart } from 'react-icons/fa';
import RatingStars from '../store/RatingStars';
import richDadBook from '../assets/LoginPage/richdadbook.png';
import api from '../api'
import { addToCartOnce, toggleFav, isFav } from "../utils/store";
import BookRow from "../components/BookRow";

export default function Books() {
  const [toggleText, setToggleText] = useState('Load More');
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories,setCategories] =useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [sort, setSort] = useState(""); // مثال: "price:asc"
  const [sortOpen, setSortOpen] = useState(false);

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoriesHeight,setCategoriesHeight] = useState('[150px]')

  const categoriesBtns = ['Business', 'Self Help', 'History', 'Romance', 'Art', 'Kids', 'Music', 'Cooking'];

  const toggleLoadMore = () => {
    if (toggleText == 'Load More') {
      setToggleText('Close');
      setCategoriesHeight('full');
    }
    if (toggleText == 'Close') {
      setToggleText('Load More');
      setCategoriesHeight('[150px]');
    }
  };

  const toggleCategory = (categoryId) => {
  setSelectedCategoryIds((prev) => {
    const exists = prev.includes(categoryId);
    const next = exists ? prev.filter((id) => id !== categoryId) : [...prev, categoryId];
    return next;
  });
  setPage(1); // أي تغيير فلتر يرجع لأول صفحة
};

 

  

const fetchCategories = async () => {
  try {
    const res = await api.get(
      "/api/categories?populate[books][fields][0]=documentId"
    );

    setCategories(res.data.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

const fetchBooks = async () => {
  try {
    const params = {
      status: "draft",
      populate: { coverImageUrl: true },
      pagination: { page, pageSize },
    };

    // ✅ sort لازم يبقى هنا (برا الشروط)
    if (sort) params.sort = sort;

    const hasCategory = selectedCategoryIds.length > 0;
    const hasSearch = debouncedSearch.trim() !== "";

    if (hasCategory && hasSearch) {
      params.filters = {
        $and: [
          { categories: { documentId: { $in: selectedCategoryIds } } },
          {
            $or: [
              { title: { $containsi: debouncedSearch } },
              { author: { $containsi: debouncedSearch } },
            ],
          },
        ],
      };
    } else if (hasCategory) {
      params.filters = {
        categories: { documentId: { $in: selectedCategoryIds } },
      };
    } else if (hasSearch) {
      params.filters = {
        $or: [
          { title: { $containsi: debouncedSearch } },
          { author: { $containsi: debouncedSearch } },
        ],
      };
    }

    // ✅ هنا التعديل: api بدل axios + بدون localhost
    const res = await api.get("/api/books", { params });

    setBooks(res.data.data);

    const meta = res.data.meta?.pagination;
    setTotal(meta?.total ?? 0);
    setPageCount(meta?.pageCount ?? 1);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
useEffect(() => {
  setPage(1);
}, [sort]);
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
}, [debouncedSearch]);


useEffect(() => {
  fetchBooks();
}, [page, pageSize, selectedCategoryIds, debouncedSearch, sort]);

useEffect(() => {
  const onClick = (e) => {
    const target = e.target;
    // لو ضغط مش جوه زرار/قائمة sort اقفلها
    if (!target.closest?.("[data-sort-wrapper='true']")) {
      setSortOpen(false);
    }
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}, []);



  // ✅ Pagination: 3 أرقام بتتحرك مع الصفحة + ...
  const getPageItems = (current, totalPages) => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - 1);
    let end = start + 2;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - 2);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) pages.push("...");

    return pages;
  };

  const pageItems = getPageItems(page, pageCount);

  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const totalLabel = total > 5000 ? "5000+" : total.toLocaleString();

  return (
    <div className="h-full w-full lg:max-w-full mx-auto  bg-[#F5F5F5] flex">
      <div className=" w-[372px] pr-[16px] border-r-1 border-[#2222221a] pl-[60px] pt-[60px] bg-[#F5F5F5] flex flex-col gap-[32px]">
        <div className="w-full flex gap-[4.5px] items-center">
          <img className='w-[24px] h-[24px]' src={settings} alt="" />
          <h4 className='text-[24px] text-[#222222] font-semibold'>Filter</h4>
        </div>

        <div className='w-full h-full flex flex-col gap-[24px] '>
          <div className='w-full flex flex-col p-[16px]  gap-[8px] bg-[#FFFFFF]  '>
            <div className={`w-full gap-[16px] h-${categoriesHeight} flex flex-col  overflow-y-hidden`}>
              <div className='w-full items-center flex justify-between'>
                <h4 className='text-[#d9176c80]'>Categories</h4>
                <IoIosArrowDown className='text-[#d9176c80]' />
              </div>

              <div className='w-full flex flex-col gap-[10px]'>
                {
                  categories.map((el) => {
                    return (
                      <div key={el.documentId} className="w-full flex items-center gap-[108px]">
                        <div className='w-[115px] flex gap-[1.5px] items-center'>
<input
  type="checkbox"
  checked={selectedCategoryIds.includes(el.documentId)}
  onChange={() => toggleCategory(el.documentId)}
  className='checkbox rounded rounde-0 p-0 w-[16px] h-[16px] bg-[#22222280]'
/>
                          <h4 className='text-[14px] text-[#222222] font-400'>{el.name}</h4>
                        </div>

                        <h4 className='text-[14px] flex w-[41px] justify-end text-[#22222280] font-400'>({el.books?.length})</h4>
                      </div>
                    )
                  })
                }
              </div>

            </div>

            <h4
              className="w-full hover:cursor-pointer flex justify-center text-[#D9176C] text-[14px] font-semibold"
              onClick={() => toggleLoadMore()}
            >
              {toggleText}
            </h4>
          </div>

          <div className='w-full flex flex-col gap-[24px]'>
            <div className='w-full p-[16px] flex justify-between items-center bg-[#FFFFFF]'>
              <h4 className='text-[18px] font-semibold text-[#222222]'>Publisher</h4>
              <MdKeyboardArrowRight className='w-[24px] h-[24px] text-[#222222]' />
            </div>

            <div className='w-full p-[16px] flex justify-between items-center bg-[#FFFFFF]'>
              <h4 className='text-[18px] font-semibold text-[#222222]'>Year</h4>
              <MdKeyboardArrowRight className='w-[24px] h-[24px] text-[#222222]' />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-[40px] h-full pl-[24px] pr-[60px] pb-[97px] pt-[60px] bg-[#F5F5F5]">
        <div className="w-full flex flex-col gap-[24px] pr-[60px] h-[150px] ">
          <div className="w-full flex justify-between items-center">
            <div className="w-full h-[59px] flex">
              <div className='relative'>
                <input
                  type="text"
                  className='outline-0 w-[688px] h-full pl-[24px] text-black text-[18px]  bg-[#FFFFFF]  rounded-l-4xl rounded-r-0 border-[#22222233] placeholder:text-[20px] placeholder:text-[#22222280] '
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or author..."
                />
                <IoMicOutline className='absolute right-[17.5px] top-[17.5px] text-2xl text-[#22222280]' />
              </div>

              <button className='bnt bg-[#FFFFFF] rounded-r-4xl w-[70px] border  border-l-[#22222280] h-full flex justify-center items-center '>
                <IoSearchOutline className='text-2xl text-[#D9176C]' />
              </button>
            </div>
            <div data-sort-wrapper="true" className="w-full h-[45px] relative">
  


            <div className="w-full h-[45px] relative">
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
      <MdKeyboardArrowRight className='absolute w-[24px] h-[24px] top-[10.5px] right-[10.5px] text-xl text-[#22222280]' />
    </div>
  )}
</div>
</div>


          </div>

<div className="w-full flex gap-[12px] flex-wrap">
  {categories.slice(0, 8).map((cat) => {
    const active = selectedCategoryIds.includes(cat.documentId);

    return (
      <button
        key={cat.documentId}
        onClick={() => toggleCategory(cat.documentId)}
        className={`
          w-[114px] h-[42px] rounded-xl
          flex justify-center items-center
          text-[16px] transition-all duration-200
          ${active ? "bg-[#d9176c80] text-white" : "bg-[#00000033] text-[#222222]"}
        `}
      >
        {cat.name}
      </button>
    );
  })}
</div>

        </div>

        <div className="w-[881px] h-[1117px] flex flex-col gap-[60px] bg-[#F5F5F5]">
          { 
books.map((book) => {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  const imgUrl =
    book?.coverImageUrl?.url ||
    book?.coverImageUrl?.data?.attributes?.url;

  const imgSrc = imgUrl
    ? imgUrl.startsWith("http")
      ? imgUrl
      : `${base}${imgUrl}`
    : richDadBook;

  return <BookRow key={book.documentId} book={book} imgSrc={imgSrc} />;
})
          }

          <div className="w-full flex flex-col items-center gap-2 mt-8">
            <div className="flex items-center gap-3">
              {/* Previous */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`flex items-center gap-2 text-[14px] font-medium
                  ${page === 1 ? "text-[#D9176C80] cursor-not-allowed" : "text-[#D9176C]"}`}
              >
                <span className="text-[18px] leading-none">‹</span>
                Previous
              </button>

              {/* Numbers */}
              <div className="flex items-center gap-2">
                {pageItems.map((it, idx) => {
                  if (it === "...") {
                    return (
                      <span key={`dots-${idx}`} className="px-2 text-[#22222280]">
                        ...
                      </span>
                    );
                  }

                  const num = it;
                  const active = num === page;

                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-semibold
                        ${active ? "bg-[#D9176C] text-white" : "bg-white text-[#222222]"}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className={`flex items-center gap-2 text-[14px] font-medium
                  ${page === pageCount ? "text-[#D9176C80] cursor-not-allowed" : "text-[#D9176C]"}`}
              >
                Next
                <span className="text-[18px] leading-none">›</span>
              </button>
            </div>

            {/* Range text */}
            <p className="text-[13px] text-[#22222280]">
              {startItem}-{endItem} of {totalLabel} Book available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}