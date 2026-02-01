
import AuthHeader from '../components/AuthHeader'
import SignupForm from '../components/SignupForm'
import BeforeLoginHeader from '../components/BeforeLoginHeader';

export default function SignupPage() {
  return (
    <div className='h-full max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[10px]'>
    <BeforeLoginHeader></BeforeLoginHeader>
    <AuthHeader title={'Create account'}/>
      <SignupForm  btnName={'Create account'} lineThrough={'sign in'}/>
    </div>
   

  )
}
