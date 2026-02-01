import { NavLink } from 'react-router-dom'
import shopLogo from '../assets/LoginPage/book-bookmark 1.png'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaEarthAfrica } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";






export default function MainFooter() {
  
  return (
    
      <div className='lg:flex hidden w-full h-[370px] px-[60px] bg-[#3B2F4A]  lg:flex-col gap-[16px] justify-center'>
       <div className="w-full flex gap-[794px] pb-[16px] border-0 border-b-1 border-b-[#ffffff33] ">
        <div className="flex w-[358px] gap-[40px] items-center">
          <div className="w-[104px] items-center flex gap-[5.5px]">
            <img src={shopLogo} alt="" />
            <p className='text-[14px] text-[#FFFFFF]'>Bookshop</p>
          </div>

          <div className='w-full flex gap-[24px] items-center'>
            <NavLink
  to="/"
  className={({ isActive }) =>
    `
     ${isActive
       ? "text-[#EAA451] hover:text-blue-500"
       : "text-white text-[16px] font-semibold  "}`
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
       : "text-white text-[16px] font-semibold"}`
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
       : "text-white text-[16px] font-semibold"}`
  }
>
  About US
</NavLink>
          </div>
        </div>

        <div className='w-full items-center justify-end flex gap-[24px]'>
            <FaFacebook className='w-[24px] h-[24px]' />
            <FaInstagram className='w-[24px] h-[24px]' />
            <FaYoutube className='w-[24px] h-[24px]' />
            <FaXTwitter className='w-[24px] h-[24px]' />



        </div>
       </div>

       <div className='w-full flex justify-between '>
        <p className='text-[14px]  text-[#FFFFFF] font-normal'>&lt;Developed By&gt; EraaSoft &lt;All Copy Rights Reserved @2024&gt;</p>

        <div className='w-[168px]  flex  items-center gap-[16px]'>
          <FaEarthAfrica className='w-[24px] h-[24px]' />
          <div className='w-[128px] h-full relative'>
              <input type="text" className='input h-full bg-transparent rounded-lg border border-[#ffffff80] placeholder:text-[14px] placeholder:text-[#ffffff80] placeholder:font-light'
                                 placeholder='English' />
              
              <MdKeyboardArrowRight className='absolute w-[20px] h-[20px]  right-3 top-[14px] -translate-y-1/2 text-gray-400' />

          </div>


        </div>
       </div>
        
      </div>
      
    
  )
}
