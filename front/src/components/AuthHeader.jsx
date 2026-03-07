import React from 'react'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';

export default function AuthHeader({title,hidden}) {
  const navigate = useNavigate();
  return (
<div className="lg:hidden w-full h-full flex flex-col  gap-[16px] px-1 ">
 

      <div className={`${hidden} w-full items-center px-[16px] flex gap-[8px]`}>
      <MdOutlineKeyboardArrowLeft className='text-[#000000] h-[22px] w-[22px]'
                                   onClick={() => navigate(-1)} />
       <h3 className='text-[16px] text-[#000000]'>{title}</h3>
      </div>
    


    </div>
  )
}
