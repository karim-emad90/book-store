import { Outlet } from "react-router-dom";
import LoginHeader from "../components/LoginHeader";

export default function MainLyout() {
  return (
    <div>
        <LoginHeader/>
        <main >
            
        <Outlet/>

        </main>
    </div>
  )
}
