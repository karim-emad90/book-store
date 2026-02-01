
import LoginForm from "../components/LoginForm";
import AuthHeader from "../components/AuthHeader";
import BeforeLoginHeader from '../components/BeforeLoginHeader';

export default function LoginPage() {
  return (
    <div className=" h-full max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[10px]">
        <BeforeLoginHeader/>
        <AuthHeader title={'Log in'}></AuthHeader>
        <LoginForm/>
      
    </div>
  

  )
}
