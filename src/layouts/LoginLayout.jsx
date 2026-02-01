import { Outlet } from "react-router-dom";
import BeforeLoginHeader from "../components/BeforeLoginHeader";
import MainFooter from "../components/MainFooter";
import AuthFooter from "../components/AuthFooter";

export default function LoginLayout() {
  
  return (
     <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <AuthFooter/>
    </div>
  )
}
