import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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










export default function MainHeader({hidden, search, setSearch}) {
    const navigate = useNavigate();
    const navigateLogin = ()=>{
     navigate('/login')
    }

    const navigateSignup = () => {
        navigate('/signup')
    }
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const [hideAfterLoginHeader,setHideAfterLoginHeader] = useState('');
  const [hideBeforeLoginHeader, setHideBeforeLoginHeader] = useState('');
    const [hideSearch,setHideSearch] = useState('')
    
   const [headerHeight,setHeaderHight] = useState(false);

  

const [cartCount, setCartCount] = useState(getCartCount());
const [favCount, setFavCount] = useState(getFavCount());

useEffect(() => {
  if (location.pathname === "/books" || location.pathname === "/cart" || location.pathname === "/bookdetails") {
    setHideSearch("hidden");
    setHeaderHight(true);
  } else {
    setHideSearch("");
    setHeaderHight(false);
  }
}, [location.pathname]);

  useEffect(() => {
  const update = () => {
    setCartCount(getCartCount());
    setFavCount(getFavCount());
  };

  window.addEventListener("storage-update", update);

  return () => window.removeEventListener("storage-update", update);
}, []);

  return (
  
    <>
            <div className={`${headerHeight?'lg:h-[92px]':'lg:h-[804px]'}  hidden lg:block w-full relative overflow-hidden`}>

  
      <div className="relative z-20 w-full h-[92px] bg-white/20 flex items-center justify-between px-4 lg:px-[140px]">

<div className='w-full flex  gap-[48px]'>
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

        <div className={`${hideAfterLoginHeader} flex items-center gap-[10px]`}>
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

        <div className={`${hideBeforeLoginHeader} flex  items-center gap-[10px]`}> 

          <div className="w-full flex items-center gap-[24px]">
                      <div className='relative w-full'>
            <CiHeart className='text-4xl'/>
            <button className="absolute -top-1 right-0 w-[18px] h-[18px] rounded-full bg-[#D9176C] text-white text-[10px] border border-white">{favCount}</button>
          </div>

                        <div className='relative w-full ' onClick={() => navigate('/cart')}>
            <IoCartOutline  className='text-4xl'/>
            <button  className="absolute -top-1 right-0 w-[18px] h-[18px] rounded-full bg-[#D9176C] text-white text-[10px] border border-white">{cartCount}</button>
          </div>
 


          </div>

          <div className='w-full flex gap-[10px] items-center'>
            <div className='relative w-[40px] h-[40px]'>
              <img src={avatar} className='w-full h-full rounded-full cover' alt="" />
              <div className='absolute top-0 right-0 w-[9.6px] h-[9.6px] bg-green-600 rounded-full border-[2px]'></div>
            </div>

            <div className='w-full flex flex-col gp-[4px]'>
              <h3 className='text-[16px] text-[#FFFFFF]'>John Smith</h3>
              <p className='text-[14px] text-[#ffffff80]'>Johnsmith@gmail.com</p>
            </div>
          </div>


        </div>


      </div>

     


      

    
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${BigLibrary})` }}
      >
        <div className={`${hideSearch} flex relative justify-self-center top-[50%] w-full  lg:w-[536px] z-22 h-[59px]`}>
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

    <div className='w-full  h-full flex flex-col lg:gap-[24px]'>
    <AuthHeader hidden={'hidden'}/>

<GlobalSearch value={search} onChange={setSearch}/>


    </div>

    </>
 

    
  

  );
}