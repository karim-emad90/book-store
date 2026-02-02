import { Outlet } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import MainFooter from "../components/MainFooter";
import BeforeLoginHeader from '../components/BeforeLoginHeader';
import AuthFooter from "../components/AuthFooter";
import LoginHeader from "../components/loginHeader";
import MainHeader from "../components/MainHeader";

export default function MainLyout() {
  return (
    
    <div className="flex w-full  flex-col bg-[#F5F5F5] gap-[24px] overflow-x-hidden  ">
        <MainHeader/>
    
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
