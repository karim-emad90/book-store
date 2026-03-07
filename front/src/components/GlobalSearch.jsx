import { useState } from "react";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";

export default function GlobalSearch({ value, onChange }) {
   
  return (
    <> 
        <div className='lg:hidden mt-7 w-full flex gap-[16px] justify-items-center '>
        <div className='lg:w-[239px] w-full flex h-[38px]'>
                <div className='w-[193px] relative'>
      <input type="text" className='outline-0 pl-[16px] w-full h-full border-r-0 rounded-r-0 rounded-l-xl border-[#22222233] bg-[#FFFFFF] text-[16px] text-black placeholder:text-[#22222233] placeholder:text-[12px]'
                                  placeholder='Serach'
                                            value={value}
          onChange={(e) => onChange(e.target.value)}  />
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
      <button onClick={() => navigate('/cart')} className="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-[#D9176C]">
         <IoCartOutline className='w-[16px] h-[16px]' />

      </button>
      <button className="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-[#FFFFFF] border-[#D9176C]">
           <CiHeart className='w-[16px] h-[16px] text-[#D9176C]' />

      </button>
    </div>
    </div>
         

          

        </>
      

  )
}
