import { Outlet } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className=" h-full w-full lg:max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[10px]">
        
        <LoginForm/>
      
    </div>
  )
}
