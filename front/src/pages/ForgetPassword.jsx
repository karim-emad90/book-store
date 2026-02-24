import BeforeLoginHeader from '../components/BeforeLoginHeader';
import AuthHeader from '../components/AuthHeader'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function ForgetPassword() {
  const validationSchema = Yup.object({
        email: Yup.string()
          .email('Please enter a valid email!')
          .required('You must fill this field!'),
  })

 
   
    const forgetPassword = async(values) => {
           try{ 
            const res = axios.post('https://bookstore.eraasoft.pro/api/forget-password','mostafa@gmail.com');
            console.log(res);

    }

    catch(err){
     console.log(err);
    }
    
  }

 
    
   
  
  return (
    
    <div className='h-full w-full lg:max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[40px] lg:gap-[14px]'>
          
          <AuthHeader title={'Forget password'}/>
          <div className=' w-full flex flex-col justify-center items-center gap-[72px] lg:gap-[16px]'>
            <p className='hidden lg:block text-[14px]  lg:text-[16px] text-[#D9176C] font-semibold'>Forget Password?</p>
            <p className='text-[14px] w-[151px] lg:w-full lg:flex-row lg:w-full lg:gap-1 justify-center flex flex-col text-center text-[#22222280]'>Enter your email <span>to reset your password</span></p>
          </div>

          <div className='lg:w-[576px] w-full flex flex-col justify-center self-center'>
            <Formik 
            initialValues={{
              email:''
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => forgetPassword(values)}>
              <Form className='w-full flex flex-col gap-[40px]'>
                <div className='w-full flex flex-col gap-[8px]'>
                  <label className='text-[18px] text-[#222222] font-semibold'>Email</label>
                  <Field className="input w-full h-[54px] bg-[#FFFFFF] text-[#222222] placeholder:text-[16px] placeholder:text-[#22222280]"
                         placeHolder="example@gmail.com"
                         name="email"></Field>
                  <ErrorMessage name="email" component={'p'} className='text-red-700 px-2 py-2'></ErrorMessage>
                </div>

                <button type='submit' className='hidden lg:block btn bg-[#D9176C] text-[18px] text-[#FFFFFF] font-semibold rounded-lg border-0'>Send reset code</button>
                <button type='submit' className='lg:hidden btn bg-[#D9176C] text-[18px] text-[#FFFFFF] font-semibold rounded-lg border-0'>Send code</button>
              </Form>

            </Formik>
          </div>
    </div>
  )
}
