import { Outlet } from "react-router-dom";
import AfterLoginHeader from "../components/AfterLoginHeader";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";

export default function AfterLoginLayout() {
  return (
     <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
        <MainHeader hidden={'hidden'}/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
