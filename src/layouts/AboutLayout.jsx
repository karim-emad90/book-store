import { Outlet } from "react-router-dom";
import AboutHeader from "../components/AboutHeader";
import MainFooter from "../components/MainFooter";

export default function AboutLayout() {
  return (
     <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
        <AboutHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
