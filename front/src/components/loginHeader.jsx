import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import bookIcon from '../assets/LoginPage/book-bookmark 1.png';
import BigLibrary from '../assets/HomPage/big-library.png';
import { FaMicrophone } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";







export default function LoginHeader() {
    const navigate = useNavigate();
    const navigateLogin = ()=>{
     navigate('/login')
    }

    const navigateSignup = () => {
        navigate('/signup')
    }
  const [openMenu, setOpenMenu] = useState(false);

  return (
  
         <div className="hidden lg:block w-full lg:h-[338px] relative overflow-hidden">

  
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

    
  

  );
}