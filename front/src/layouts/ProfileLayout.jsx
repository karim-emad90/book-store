import { Outlet } from "react-router-dom";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";
import MobileFooter from "../components/MobileFooter";

export default function ProfileLayout() {
  return (
    <div className="flex flex-col bg-[#F5F5F5]">
      <MainHeader hidden={"hidden"} mobileSimple={true} />

      <main className="relative min-h-screen overflow-visible z-[10020]">
        <Outlet />
      </main>

      <MainFooter />
      <MobileFooter /> 
    </div>
  );
}