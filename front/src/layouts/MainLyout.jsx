import { Outlet } from "react-router-dom";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";
import MobileFooter from "../components/MobileFooter";
import BeforeLoginHeader from "../components/BeforeLoginHeader"

export default function MainLyout() {
  return (
    
    <div className="flex flex-col bg-[#F5F5F5] gap-[24px] overflow-x-hidden  ">
        <BeforeLoginHeader hidden={'hidden'} mobileSimple={true}/>
    
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
        <MobileFooter/>
    </div>
  )
}
