import { Outlet } from "react-router-dom";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";

export default function CartLayout() {
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
