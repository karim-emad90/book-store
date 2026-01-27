import { Outlet } from "react-router-dom";
import LoginHeader from "../components/LoginHeader";

export default function MainLyout() {
  return (
    <div>
        <LoginHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
    </div>
  )
}
