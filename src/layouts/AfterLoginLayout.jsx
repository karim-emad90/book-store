import { Outlet } from "react-router-dom";
import AfterLoginHeader from "../components/AfterLoginHeader";
import MainFooter from "../components/MainFooter";

export default function AfterLoginLayout() {
  return (
     <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
        <AfterLoginHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
