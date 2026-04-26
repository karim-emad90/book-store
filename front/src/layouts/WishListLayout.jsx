import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import MobileFooter from "../components/MobileFooter";

export default function WishListLayout() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <MainHeader mobileSimple={true} />
      <main className="flex-1">
        <Outlet />
      </main>
      <MainFooter />
      <MobileFooter /> 
    </div>
  );
}