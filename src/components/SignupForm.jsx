import axios from "axios";
import { Field, Formik, Form } from "formik";
import { FaEye, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignupForm() {
     const handleSigup = async (values) => {
        console.log(values);
            try{
                
                const signupData = {
                    first_name: values.firstname,
                    last_name: values.lastname,
                    email: values.email,
                    password: values.password,
                    password_confirmation: values.passwordconfirmation

                }
    
                const res = await axios.post('https://bookstore.eraasoft.pro/api/register',signupData);
                console.log(res);
    
            }
            
            catch(err){
              console.log(err);
            }
           
        }
  return (
    <div className="w-full flex justify-center items-center h-full  ">
            <div className="w-[576px]  flex flex-col gap-[40px] ">
                <Formik initialValues={{
                    firstname:'',
                    lastname:'',
                    email:'',
                    password:'',
                    passwordconfirmation:'',
                    remember: false
                }} onSubmit={(values)=>handleSigup(values)} >
                    <Form className="w-full   flex flex-col gap-[24px]">
                        <div className="w-full flex justify-between">
                            <div className="w-[280px] flex flex-col gap-[8px]">
                                <label className="text-[#222222] text-[18px] font-semibold" >First Name</label>
                                <Field className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                                       placeholder="John"
                                       name='firstname'
                                       ></Field>

                            </div>

                            <div className="w-[280px] flex flex-col gap-[8px]">
                                <label className="text-[#222222] text-[18px] font-semibold">Last Name</label>
                                <Field className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                                       placeholder="Smith"
                                       name="lastname"
                                       ></Field>

                            </div>

                        </div>
                        <div className="w-full flex flex-col gap-[8px]">
                            <label className="text-[18px] font-semibold text-[#222222]">Email</label>
                            <Field className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                                   placeholder="example@gmail.com"
                                   name="email"
                            ></Field>
    
                        </div>
    
                        <div className="w-full flex flex-col gap-[14px]">
                            <label className="text-[18px] font-semibold text-[#222222]">Password</label>
    
                            <div className="relative w-full">
                                <Field className="z-0 input w-full text-neutral-900 h-[54px] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                                   placeholder="Enter password"
                                   name="password"
                            ></Field>
    
                                <FaEye className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer z-10" />
    
                            </div>

                            <label className="text-[18px] font-semibold text-[#222222]">Confirm password</label>

                            <div className="relative w-full">
                                <Field className="z-0 input w-full text-neutral-900 h-[54px] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal mb-[10px]"
                                   placeholder="Enter password"
                                   name="passwordconfirmation"
                            ></Field>
    
                                <FaEye className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer z-10" />
    
                            </div>
    
                            <div className="w-full flex justify-between items-center ">
                                <section className="w-full text-neutral-900 flex items-center gap-[8px]">
                                     <Field
          type="checkbox"
          id="remember"
          name="remember"
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
                                         <div className="text-[#222222] w-full flex text-[12px] font-normal select-none">
                                             <p>Agree with <span className="text-orange-600">Terms & Conditions</span></p>
                                         </div>
                                </section>
                                
    
                            </div>
                            <button 
                            type="submit"
                            className="btn w-full h-[48px] bg-[#D9176C] text-[#FFFFFF] font-semibold rounded-xl border-0 mt-[40px]">Sign Up</button>
                            <div className="w-full text-[#222222] text-[16px] font-normal flex justify-center mt-[40px]">
                                <p>Already have an account?<a href="#" className="text-[#D9176C] text-[16px] font-semibold">Login</a></p>
                            </div>
    
                            <div className="w-full h-[148px] gap-[12px] flex flex-col items-center mt-[40px]">
                                <h5 className="slef-center">or</h5>
                                <div className="w-full relative">
                                    <button className="btn w-full h-[46px]  bg-[#FFFFFF] text-[#222222] text-[14px] font-normal border-0 rounded-xl">Sign up with Google</button>
                                    <FcGoogle className="absolute left-[205px] top-[16px]" />
    
                                </div>
                                
                                <div className="w-full relative">
                                    <button className="btn w-full   h-[46px] bg-[#FFFFFF] text-[#222222] text-[14px] font-normal border-0 rounded-xl">Sign up with Facebook</button>
                                    <FaFacebook className="absolute left-[198px] top-[16px] text-blue-600" />
    
                                </div>
                                
    
                            </div>
                            
    
                        </div>
                    </Form>
                </Formik>
    
            </div>
          
        </div>
  )
}
