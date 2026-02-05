import { Outlet } from "react-router-dom";
import AboutHeader from "../components/AboutHeader";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";

export default function AboutLayout() {
  return (
    <div className="flex flex-col bg-[#F5F5F5] ">
        <MainHeader hidden={'hidden'}/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
