
import { NavLink } from 'react-router-dom'
import bookIcon from '../assets/LoginPage/book-bookmark 1.png'

export default function MainHeader() {
  return (

<div className="relative z-20 w-full h-[92px] bg-white/20 flex items-center justify-between px-4 lg:px-[140px]">
    <div className='w-full flex  gap-[48px]'>
          <div className="flex items-center gap-[10px] text-white">
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
    </div>

    

  )
}

