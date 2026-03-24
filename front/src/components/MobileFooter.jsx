import { useNavigate } from "react-router-dom";

export default function MobileFooter() {
  const navigate = useNavigate();
  return (
    // <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      
    //   {/* Footer */}
    //   <div className="relative bg-white border-t h-[64px] px-[43px] flex justify-between  items-center">

    //     {/* Home */}
    //     <div className="w-full flex gap-7">
    //           <NavLink to="/" className="flex flex-col items-center text-xs text-gray-500">
    //       <img src={homeIcon} alt="" />
    //       <span>Home</span>
    //     </NavLink>

    //           <NavLink to="/" className="flex flex-col items-center text-xs text-gray-500">
    //       <img src={booksIcon} alt="" />
    //       <span>Books</span>
    //     </NavLink>
    //     </div>
        

    //    <div className="w-full flex justify-end gap-5">
    //     <NavLink to="/cart" className="flex flex-col items-center text-xs text-gray-500">
    //       <img src={cartIcon} alt="" />
    //       <span>My Cart</span>
    //     </NavLink>

    //     {/* Profile */}
    //     <NavLink to="/profile" className="flex flex-col items-center text-xs text-gray-500">
    //       <img src={profileIcon} alt="" />
    //       <span>’Profile</span>
    //     </NavLink>


    //    </div>
    //     {/* Cart */}
        
    //     {/* White cut circle */}
    //     <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-[80px] h-[80px] bg-[#F5F5F5] rounded-full z-10" />

    //     {/* Center Button */}
    //     <NavLink
    //       to="/books"
    //       className="absolute left-1/2 -translate-x-1/2 -top-6 z-20 
    //                  w-[56px] h-[56px]  rounded-full 
    //                  flex items-center justify-center bg-white text-white text-xl shadow-lg"
    //     >
    //       <img src={searchIcon} alt="" />
    //     </NavLink>

    //   </div>
    // </div>
    <div className="mt-6 lg:hidden  bg-[#43264F] px-6 pt-5  text-white">
  <div className="flex items-center justify-center gap-6 text-[15px] font-medium">
    <button className="hover:text-[#F8D2E3] transition"
            onClick={() => navigate('/')}>Home</button>

    <span className="h-5 w-px bg-white/20"></span>

    <button className="hover:text-[#F8D2E3] transition"
            onClick={() => navigate('/books')}>Books</button>

    <span className="h-5 w-px bg-white/20"></span>

    <button className="hover:text-[#F8D2E3] transition"
            onClick={() => navigate('/about')}>About Us</button>
  </div>

  <div className="mt-5 h-px w-full bg-white/10"></div>

  <p className="mt-4 text-center text-[13px] text-white/80 leading-6">
    Developed by Faissoft • All Copy Rights Reserved ©2024
  </p>
</div>
  );
}