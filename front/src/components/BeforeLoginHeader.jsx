import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import bookIcon from '../assets/LoginPage/book-bookmark 1.png';
import BigLibrary from '../assets/HomPage/big-library.png';
import { FaMicrophone } from "react-icons/fa";
import { CiHeart, CiSearch } from "react-icons/ci";
import MainHeader from './MainHeader';
import { getCartCount, getFavCount } from '../utils/store';
import { IoCartOutline } from 'react-icons/io5';







export default function BeforeLoginHeader({ hidden, mobileSimple = false }) {
    const navigate = useNavigate();
    const navigateLogin = ()=>{
     navigate('/login')
    }

    const navigateSignup = () => {
        navigate('/signup')
    }
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
    const [favCount, setFavCount] = useState(getFavCount());

  return (
    <>
    
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
         <div className="hidden lg:block lg:h-[804px] relative overflow-hidden">
          

  
      <div className="relative z-20 w-full h-[92px] bg-white/20 flex items-center justify-between px-4 lg:px-[140px]">

<div className='hidden lg:w-full lg:flex  gap-[48px]'>
          <div className="hidden lg:flex items-center gap-[10px] text-white">
          <img src={bookIcon} alt="bookIcon" className="w-[28px]" />
          <span className="text-[16px] font-light">Bookshop</span>
        </div>

        <div className="hidden lg:flex gap-[40px] text-white text-[18px] no-underline font-semibold">
          <NavLink
  to="/"
  className={({ isActive }) =>
    `
     ${isActive
       ? "text-[#EAA451] hover:text-blue-500"
       : "text-white text-[18px] font-semibold  "}`
  }
>
  Home
</NavLink>
<NavLink
  to="/books"
  className={({ isActive }) =>
    `
     ${isActive
       ? "text-[#EAA451] hover:text-blue-500"
       : "text-white text-[18px] font-semibold"}`
  }
>
  Books
</NavLink>

<NavLink
  to="/about"
  className={({ isActive }) =>
    `
     ${isActive
       ? "text-[#EAA451] hover:text-blue-500"
       : "text-white text-[18px] font-semibold"}`
  }
>
  About US
</NavLink>
     

        </div>

    </div>

        <div className=" flex items-center gap-[10px]">
          <button 
          className="btn h-[40px] px-4 bg-[#D9176C] border-0 text-white"
          onClick={navigateLogin}
          >
            Login
          </button>
          <button 
          onClick={navigateSignup}
          className="btn h-[40px] px-4 bg-white text-[#D9176C] border border-[#D9176C]">
            Signup
          </button>
        </div>


      </div>

     


      

    
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${BigLibrary})` }}
      >
        <div className='relative flex justify-self-center top-[50%]  w-[536px] z-22 h-[59px]'>
  <div className="relative w-full">
    <input
      type="text"
      className="h-full text-black text-xl w-full bg-white rounded-l-4xl rounded-r-0
      placeholder:text-[#22222280] placeholder:text-[20px]
      px-7 pr-14"
      placeholder="Search"
    />

    {/* mic icon */}
    <FaMicrophone
      className="absolute right-4 top-1/2 -translate-y-1/2
      text-gray-500 cursor-pointer text-2xl"
    />
  </div>

  <button
    className="h-full w-[70px] bg-[#D9176C]
    rounded-r-4xl rounded-l-0
    flex items-center justify-center
    
    "
  >
    <CiSearch className="text-white text-2xl font-semibold" />
  </button>
      </div>
      </div>
    </div>

 
    </>

    
  

  );
}