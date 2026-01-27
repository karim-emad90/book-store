import { Outlet } from "react-router-dom";
import LoginHeader from "../components/LoginHeader";

export default function MainLyout() {
  return (
    <div className="flex flex-col gap-20 lg:gap-20">
        <LoginHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
    </div>
  )
}
