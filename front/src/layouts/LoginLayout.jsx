import { Outlet } from "react-router-dom";
import BeforeLoginHeader from "../components/BeforeLoginHeader";
import MainFooter from "../components/MainFooter";
import AuthFooter from "../components/AuthFooter";
import MainHeader from "../components/MainHeader";
import LoginHeader from "../components/loginHeader";

export default function LoginLayout() {
  
  return (
     <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
       <LoginHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <AuthFooter/>
    </div>
  )
}
