

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import libraryBackGround from '../assets/LoginPage/library-background.png';
import MainHeader from './MainHeader';

export default function AfterLoginHeader() {
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

  
      <div className="relative z-20 w-full h-full bg-white/20  flex  justify-between ">
        
<MainHeader/>



    
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${libraryBackGround})` }}
      />
    </div>
  
</div>)}

