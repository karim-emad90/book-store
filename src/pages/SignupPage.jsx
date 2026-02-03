
import AuthHeader from '../components/AuthHeader'
import SignupForm from '../components/SignupForm'
import BeforeLoginHeader from '../components/BeforeLoginHeader';
import AuthFooter from '../components/AuthFooter';
import LoginHeader from '../components/loginHeader';

export default function SignupPage() {
  return (
    <div className='h-full max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[10px]'>
     
    <AuthHeader title={'Create account'}/>
      <SignupForm  btnName={'Create account'} lineThrough={'sign in'}/>
    </div>
   

  )
}
