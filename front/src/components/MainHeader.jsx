import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bookIcon from '../assets/LoginPage/book-bookmark 1.png';
import BigLibrary from '../assets/HomPage/big-library.png';
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import avatar from '../assets/AfterLoginPage/Avatar Image (1).png';
import { getCartCount, getFavCount } from "../utils/store";
import GlobalSearch from './GlobalSearch';

export default function MainHeader({ hidden, search, setSearch, mobileSimple = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [cartCount, setCartCount] = useState(getCartCount());
  const [favCount, setFavCount] = useState(getFavCount());
  const [headerHeight, setHeaderHeight] = useState(false);
  const [hideSearch, setHideSearch] = useState("");
  const [aboutHeader,setAboutHeader] = useState(false);

  useEffect(() => {
    if (location.pathname === "/books" || location.pathname === "/cart" || location.pathname ==='/' ||  location.pathname === "/" || location.pathname === `/book/${id}` || location.pathname === `/checkout`) {
      setHideSearch("hidden");
      setHeaderHeight(true);
    }
    else if(location.pathname === "/about"   ){
      setAboutHeader(true);
      setHideSearch("");
      setHeaderHeight(false);

    }
     else {
      setHideSearch("");
      setHeaderHeight(false);
      setAboutHeader(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount());
      setFavCount(getFavCount());
    };

    updateCounts();
    window.addEventListener("storage-update", updateCounts);

    return () => {
      window.removeEventListener("storage-update", updateCounts);
    };
  }, []);

  return (
    <>
    
      {/* 🔥 Desktop Header */}
      <div className={`${headerHeight ? 'lg:h-[92px]' : 'lg:h-[804px]'} hidden lg:block w-full relative`}>
        
        <div className="relative z-20 w-full h-[92px] bg-white/20 flex items-center justify-between px-[140px]">

          <div className='flex gap-[48px]'>

            <div className="flex items-center gap-[10px] text-white">
              <img src={bookIcon} className="w-[28px]" />
              <span>Bookshop</span>
            </div>

            <div className="flex gap-[40px] text-white font-semibold">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/books">Books</NavLink>
              <NavLink to="/about">About</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-[20px]">
            <div className='relative'>
              <CiHeart className='text-3xl text-white' />
              <span className="absolute -top-1 right-0 bg-[#D9176C] text-white text-xs px-1 rounded-full">{favCount}</span>
            </div>

            <div className='relative cursor-pointer' onClick={() => navigate('/cart')}>
              <IoCartOutline className='text-3xl text-white' />
              <span className="absolute -top-1 right-0 bg-[#D9176C] text-white text-xs px-1 rounded-full">{cartCount}</span>
            </div>

            <img src={avatar} className='w-[40px] h-[40px] rounded-full' />
          </div>
        </div>

        <div
          className='absolute inset-0 bg-cover'
          style={{ backgroundImage: `url(${BigLibrary})` }}
        />
      </div>
      {
        aboutHeader && (
          <div className="hidden lg:absolute inset-0 z-10 w-full lg:flex flex-col gap-[16px] justify-center items-center bg-black/30 ">
            <h1 className='flex justify-center text-[48px] text-[#FFFFFF] font-bold'>About Bookshop</h1>
           <p className="w-[652px] text-[24px] text-[#FFFFFF] mx-auto leading-relaxed text-center">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.
</p>
          </div>
        )
      }

      {/* 🔥 Mobile Header */}
      {/* <div className="lg:hidden fixed top-0 left-0 w-full h-[70px] bg-white flex items-center justify-between px-4 z-50 shadow">

        <span className="font-bold">Bookshop</span>

        <div className="flex gap-4 items-center">
          <div className='relative'>
            <CiHeart className='text-2xl' />
            <span className="absolute -top-1 right-0 bg-[#D9176C] text-white text-[10px] px-1 rounded-full">{favCount}</span>
          </div>

          <div className='relative' onClick={() => navigate('/cart')}>
            <IoCartOutline className='text-2xl' />
            <span className="absolute -top-1 right-0 bg-[#D9176C] text-white text-[10px] px-1 rounded-full">{cartCount}</span>
          </div>
        </div>
      </div> */}

{mobileSimple ? (
  <div className="lg:hidden sticky top-0 z-50 w-full bg-[#43264F] text-white shadow-md">
    <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
      
      <div
        className="flex items-center gap-2 shrink-0 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={bookIcon} className="w-[24px]" alt="Bookshop" />
        <span className="text-[18px] font-semibold">Bookshop</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/favorites')}
        >
          <CiHeart className="text-[26px] text-white" />
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#D9176C] text-[10px] text-white leading-none">
            {favCount}
          </span>
        </div>

        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/cart')}
        >
          <IoCartOutline className="text-[26px] text-white" />
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#D9176C] text-[10px] text-white leading-none">
            {cartCount}
          </span>
        </div>
      </div>
    </div>

    <div className="px-4 pb-4">
      <div className="h-px w-full bg-white/10 mb-3"></div>

      <div className="flex items-center justify-center gap-4 text-[14px] font-medium">
        <button
          className="hover:text-[#F8D2E3] transition"
          onClick={() => navigate('/')}
        >
          Home
        </button>

        <span className="h-4 w-px bg-white/20"></span>

        <button
          className="hover:text-[#F8D2E3] transition"
          onClick={() => navigate('/books')}
        >
          Books
        </button>

        <span className="h-4 w-px bg-white/20"></span>

        <button
          className="hover:text-[#F8D2E3] transition"
          onClick={() => navigate('/about')}
        >
          About Us
        </button>
      </div>
    </div>
  </div>
) : (
  <div className="lg:hidden w-full px-4 pt-[20px]">
    <GlobalSearch value={search} onChange={setSearch} />
  </div>
)}
    </>
  );
}