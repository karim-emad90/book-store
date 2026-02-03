import { NavLink } from "react-router-dom";
import homeIcon from '../assets/MobileFooter/home (2) 3.png';
import booksIcon from '../assets/MobileFooter/book-bookmark (2) 1.png';
import searchIcon from '../assets/MobileFooter/search (4) 1.png';
import cartIcon from '../assets/MobileFooter/shopping-cart (1) 1.png';
import profileIcon from '../assets/MobileFooter/Avatar Image.png';

export default function MobileFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      
      {/* Footer */}
      <div className="relative bg-white border-t h-[64px] px-[43px] flex justify-between  items-center">

        {/* Home */}
        <div className="w-full flex gap-7">
              <NavLink to="/" className="flex flex-col items-center text-xs text-gray-500">
          <img src={homeIcon} alt="" />
          <span>Home</span>
        </NavLink>

              <NavLink to="/" className="flex flex-col items-center text-xs text-gray-500">
          <img src={booksIcon} alt="" />
          <span>Books</span>
        </NavLink>
        </div>
        

       <div className="w-full flex justify-end gap-5">
        <NavLink to="/cart" className="flex flex-col items-center text-xs text-gray-500">
          <img src={cartIcon} alt="" />
          <span>My Cart</span>
        </NavLink>

        {/* Profile */}
        <NavLink to="/profile" className="flex flex-col items-center text-xs text-gray-500">
          <img src={profileIcon} alt="" />
          <span>’Profile</span>
        </NavLink>


       </div>
        {/* Cart */}
        
        {/* White cut circle */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-[80px] h-[80px] bg-[#F5F5F5] rounded-full z-10" />

        {/* Center Button */}
        <NavLink
          to="/books"
          className="absolute left-1/2 -translate-x-1/2 -top-6 z-20 
                     w-[56px] h-[56px]  rounded-full 
                     flex items-center justify-center bg-white text-white text-xl shadow-lg"
        >
          <img src={searchIcon} alt="" />
        </NavLink>

      </div>
    </div>
  );
}