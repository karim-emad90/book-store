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










export default function MainHeader() {
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

  useEffect(() => {
    if(location.pathname == '/afterlogin'){
       setHideAfterLoginHeader('hidden');
    }
    if(location.pathname == '/' || location.pathname == '/beforelogin'){
      setHideBeforeLoginHeader('hidden');
    }
  },[])

  return (
  
    <>
            <div className=" hidden lg:block w-full lg:h-[804px] relative overflow-hidden">

  
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
            <button className="absolute -top-1 right-0 w-[18px] h-[18px] rounded-full bg-[#D9176C] text-white text-[10px] border border-white">12</button>
          </div>

                        <div className='relative w-full'>
            <IoCartOutline className='text-4xl'/>
            <button className="absolute -top-1 right-0 w-[18px] h-[18px] rounded-full bg-[#D9176C] text-white text-[10px] border border-white">10</button>
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
        <div className='flex relative justify-self-center top-[50%] w-full  lg:w-[536px] z-22 h-[59px]'>
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
    <div className='lg:hidden w-full flex gap-[16px] justify-items-center '>
      <div className='lg:w-[239px] w-full flex h-[38px]'>
        <div className='w-[193px] relative'>
           <input type="text" className='outline-0 pl-[16px] w-full h-full border-r-0 rounded-r-0 rounded-l-xl border-[#22222233] bg-[#FFFFFF] text-[16px] text-black placeholder:text-[#22222233] placeholder:text-[12px]'
                              placeholder='Serach'  />
               <FaMicrophone
      className="absolute right-2 top-1/2 -translate-y-1/2
      text-[#00000080] cursor-pointer text-xl"
    />
        </div>
        
        <button className='flex justify-center items-center w-[46px] h-[38px] outline-0 apperance-none bg-[#FFFFFF] border-l-1  rounded-r-3xl border-[#22222233]'>
          <CiSearch className='w-[14px] h-[14px] text-[#D9176C]' />

        </button>
      </div>

          <div className='w-[88px] flex gap-[8px] justify-items-center'>
      <button className="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-[#D9176C]">
         <IoCartOutline className='w-[16px] h-[16px]' />

      </button>
      <button className="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-[#FFFFFF] border-[#D9176C]">
           <CiHeart className='w-[16px] h-[16px] text-[#D9176C]' />

      </button>
    </div>
    </div>



    </div>

    </>
 

    
  

  );
}