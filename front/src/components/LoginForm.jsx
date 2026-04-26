import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaEye, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useStore from "../store/store";
import toast from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email!")
      .required("You must fill this field!"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is required!"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login({
        identifier: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (!result.success) {
        throw new Error(result.error || "Login failed");
      }

      toast.success("Login succeeded!");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (err) {
      const message =
        err?.message || "Please check your account details or sign up first.";

      Swal.fire({
        title: "Login failed!",
        text: message,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#D9176C",
        cancelButtonColor: "#9CA3AF",
        cancelButtonText: "Close",
        confirmButtonText: "Sign up",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-dvh px-1 lg:px-0">
      <div className="w-full px-0 h-full lg:h-[636px] lg:w-[576px] flex flex-col gap-[40px]">
        <h2 className="hidden lg:block text-[#D9176C] font-semibold text-[16px] self-center">
          Welcome Back!
        </h2>

        <Formik
          initialValues={{ email: "", password: "", remember: false }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="w-full px-0 flex flex-col lg:gap-[24px]">
              <div className="w-full flex flex-col gap-[8px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Email
                </label>
                <Field
                  className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:lg:text-[16px] placeholder:text-[12px] placeholder:font-normal"
                  placeholder="example@gmail.com"
                  name="email"
                  type="email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-700 px-2 py-2"
                />
              </div>

              <div className="w-full flex flex-col gap-[8px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Password
                </label>
                <div className="relative w-full">
                  <Field
                    className="z-0 input w-full text-neutral-900 h-[54px] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:lg:text-[16px] placeholder:text-[12px] placeholder:font-normal"
                    placeholder="Enter password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-700 px-2 py-2"
                  />
                  <FaEye
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              <div className="w-full flex gap-[99px] lg:gap-[323px] items-center">
                <section className="w-full lg:w-[121px] text-neutral-900 flex items-center gap-[8px]">
                  <Field
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="lg:h-5 lg:w-5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[#222222] text-[12px] lg:text-[14px] lg:w-[97px] font-normal select-none"
                  >
                    Remember me
                  </label>
                </section>

                <a
                  className="text-[#D9176C] w-full font-normal text-[14px] lg:text-[16px] cursor-pointer"
                  onClick={() => {
                    navigate("/forget");
                  }}
                >
                  Forget password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-full h-[48px] text-[16px] bg-[#D9176C] text-[#FFFFFF] font-semibold rounded-lg lg:rounded-xl border-0 mt-[40px] disabled:opacity-70"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>

              <div className="w-full order-2 lg:order-3 text-[#222222] text-[16px] font-normal flex justify-center mt-0 lg:mt-[40px]">
                <p>
                  Don’t have an account?
                  <a
                    className="text-[#D9176C] text-[16px] font-semibold cursor-pointer"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Signup
                  </a>
                </p>
              </div>

              <div className="w-full h-[148px] gap-[12px] flex flex-col items-center mt-[40px]">
                <div className="w-full order-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="h-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm whitespace-nowrap">
                    Or login with
                  </span>
                  <div className="h-px bg-gray-300"></div>
                </div>

                <div className="w-full order-3 lg:order-2 flex justify-between lg:flex-col gap-[16px]">
                  <div className="w-full lg:w-full relative">
                    <button
                      type="button"
                      className="hidden lg:block btn w-full h-[46px] bg-[#FFFFFF] text-[#222222] text-[14px] font-normal border-0 rounded-xl"
                    >
                      Login with Google
                    </button>

                    <button
                      type="button"
                      className="lg:hidden btn w-[163.5px] h-[54px] bg-[#FFFFFF] text-[#222222] text-[16px] lg:text-[14px] font-normal border-0 rounded-xl"
                    >
                      Google
                    </button>

                    <FcGoogle className="absolute w-[22px] h-[22px] lg:w-[20px] lg:h-[20px] left-[30px] top-[15px] lg:left-[208px] lg:top-[12px]" />
                  </div>

                  <div className="w-full lg:w-full relative">
                    <button
                      type="button"
                      className="hidden lg:block btn w-full h-[46px] bg-[#FFFFFF] text-[#222222] text-[14px] font-normal border-0 rounded-xl"
                    >
                      Login with Facebook
                    </button>

                    <button
                      type="button"
                      className="lg:hidden h-[54px] btn w-full bg-[#FFFFFF] text-[#222222] text-[16px] lg:text-[14px] font-normal border-0 rounded-xl"
                    >
                      Facebook
                    </button>

                    <FaFacebook className="absolute w-[22px] h-[22px] lg:w-[20px] lg:h-[20px] left-[21px] top-[15px] lg:left-[200px] lg:top-[12px] text-blue-600" />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}