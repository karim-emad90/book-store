import React from 'react'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import cellular from '../assets/MainAuthHeader/Cellular Connection.png';
import wifi from '../assets/MainAuthHeader/Wifi.png';
import battery from '../assets/MainAuthHeader/Battery.png';

export default function AuthHeader() {
  return (
<div className="lg:hidden [w-full] h-full flex flex-col gap-[16px] ">
      <div className='w-full pr-[14.67px] pl-[32px] pt-[14px] pb-[10px] items-center flex gap-[235px]'>
       <p className='w-[27px] text-[15px] font-[500] text-black'>9:41</p>
        <div className='w-[66.66px] flex gap-[5px]'>
          <img className='w-[17px] h-[10.67px]' src={cellular} alt="" />
          <img className='w-[15.33px] h-[10.67px]' src={wifi} alt="" />
          <img className='w-[24.33px] h-[10.67px]' src={battery} alt="" />
        </div>
      </div>

      <div className='w-[343px] items-center px-[16px] flex gap-[8px]'>
      <MdOutlineKeyboardArrowLeft className='text-[#000000] h-[22px] w-[22px]' />
       <h3 className='text-[16px] text-[#000000]'>Log in</h3>
      </div>


    </div>
  )
}
