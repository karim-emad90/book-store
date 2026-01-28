import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import bookIcon from '../assets/LoginPage/book-bookmark 1.png';
import libraryBackGround from '../assets/LoginPage/library-background.png';

export default function AuthHeader() {
    const navigate = useNavigate();
    const navigateLogin = ()=>{
     navigate('/login')
    }

    const navigateSignup = () => {
        navigate('/signup')
    }
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="w-full h-[383px] relative overflow-hidden">

  
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

        <div className="hidden lg:flex items-center gap-[10px]">
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

        <button
          className="lg:hidden text-white text-[22px]"
          onClick={() => setOpenMenu(true)}
        >
          <FaBars />
        </button>
      </div>

     
      {openMenu && (
        <div className="fixed inset-0 z-30 bg-black/50 flex justify-end">
          <div className="w-[80%] h-full bg-white p-[24px] flex flex-col gap-[32px]">

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[8px]">
                <img src={bookIcon} className="w-[28px]" />
                <span className="text-[16px] font-semibold">Bookshop</span>
              </div>

              <button onClick={() => setOpenMenu(false)} className="text-[22px]">
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col gap-[20px] text-[18px] font-medium">
              <button 
                          onClick={() => {
          setOpenMenu(false);
          navigate('/');
        }}
                    className='text-neutral-900'
                    >Home</button>
              <button 
      onClick={() => {
          setOpenMenu(false);
          navigate('/books');
        }}
                    className='text-neutral-900'
                    >Books</button>
              <button 
                    className='text-neutral-900'
                          onClick={() => {
          
          navigate('/about');
          setOpenMenu(false);
        }}
                    >About us</button>
            </div>

            <div className="mt-auto flex flex-col gap-[12px]">
              <button className="w-full h-[48px] bg-[#D9176C] text-white rounded-xl font-semibold"
                      onClick={()=>{navigateLogin();
                          setOpenMenu(false)}}
                      >
                Login
              </button>
              <button className="w-full h-[48px] bg-white text-[#D9176C] border border-[#D9176C] rounded-xl font-semibold"
                      onClick={() => {navigateSignup();
                        setOpenMenu(false)
                      }}
                      >
                Signup
              </button>
            </div>

          </div>
        </div>
      )}

    
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${libraryBackGround})` }}
      />
    </div>
  );
}