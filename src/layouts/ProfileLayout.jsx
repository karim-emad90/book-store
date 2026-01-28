import { Outlet } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import MainFooter from "../components/MainFooter";

export default function ProfileLayout() {
  return (
     <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
        <ProfileHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
