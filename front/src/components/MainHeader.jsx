import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bookIcon from '../assets/LoginPage/book-bookmark 1.png';
import BigLibrary from '../assets/HomPage/big-library.png';
import { FaMicrophone } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import AuthHeader from './AuthHeader';
import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import avatar from '../assets/AfterLoginPage/Avatar Image (1).png';
import { getCartCount, getFavCount } from "../utils/store";
import GlobalSearch from './GlobalSearch';

export default function MainHeader({ hidden, search, setSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [cartCount, setCartCount] = useState(getCartCount());
  const [favCount, setFavCount] = useState(getFavCount());
  const [headerHeight, setHeaderHeight] = useState(false);
  const [hideSearch, setHideSearch] = useState("");

  useEffect(() => {
    if (location.pathname === "/books" || location.pathname === "/cart" || location.pathname === `/book/${id}`) {
      setHideSearch("hidden");
      setHeaderHeight(true);
    } else {
      setHideSearch("");
      setHeaderHeight(false);
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
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${BigLibrary})` }}
        />
      </div>

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

      <div className='lg:hidden w-[300px] pt-[20px]'>
        <GlobalSearch value={search} onChange={setSearch} />
      </div>
    </>
  );
}