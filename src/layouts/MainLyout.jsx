import { Outlet } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import MainFooter from "../components/MainFooter";
import BeforeLoginHeader from '../components/BeforeLoginHeader';
import AuthFooter from "../components/AuthFooter";
import LoginHeader from "../components/loginHeader";

export default function MainLyout() {
  return (
    
    <div className="flex flex-col bg-[#F5F5F5] ">
        <LoginHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
