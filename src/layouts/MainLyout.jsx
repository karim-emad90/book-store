import { Outlet } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import MainFooter from "../components/MainFooter";
import BeforeLoginHeader from '../components/BeforeLoginHeader';

export default function MainLyout() {
  return (
    <div className="flex flex-col bg-[#F5F5F5] ">
        <BeforeLoginHeader></BeforeLoginHeader>
        <AuthHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
