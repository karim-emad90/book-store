import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import useStore from "../store/store";
import api from "../api";

const passwordRulesMessage =
  "Password must be at least 8 characters and include uppercase, lowercase and number.";

const safeJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const syncAuthStorage = ({ jwt, user }) => {
  if (!jwt || !user) return;

  localStorage.setItem("jwt", jwt);
  localStorage.setItem("token", jwt);
  localStorage.setItem("user", JSON.stringify(user));

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    const parsed = safeJson(raw);

    if (!parsed || typeof parsed !== "object") continue;

    if (parsed.state && ("user" in parsed.state || "token" in parsed.state || "jwt" in parsed.state)) {
      parsed.state = {
        ...parsed.state,
        user,
        token: jwt,
        jwt,
        authChecked: true,
        isAuthenticated: true,
      };

      localStorage.setItem(key, JSON.stringify(parsed));
    }
  }

  window.dispatchEvent(new Event("storage-update"));
};

export default function SignupForm({
  btnName = "Sign Up",
  lineThrough = "sign up",
}) {
  const navigate = useNavigate();

  const loading = useStore((state) => state.loading);
  const setUser = useStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signupSchema = useMemo(
    () =>
      Yup.object({
        firstname: Yup.string()
          .trim()
          .required("First name is required!")
          .min(2, "First name must be at least 2 characters")
          .max(20, "First name must be less than 20 characters"),

        lastname: Yup.string()
          .trim()
          .required("Last name is required!")
          .min(2, "Last name must be at least 2 characters")
          .max(20, "Last name must be less than 20 characters"),

        email: Yup.string()
          .trim()
          .required("Email is required!")
          .email("Please enter a valid email!"),

        password: Yup.string()
          .required("Password is required!")
          .min(8, passwordRulesMessage)
          .matches(/[a-z]/, passwordRulesMessage)
          .matches(/[A-Z]/, passwordRulesMessage)
          .matches(/[0-9]/, passwordRulesMessage)
          .max(64, "Password is too long"),

        passwordconfirmation: Yup.string()
          .required("Confirm password is required!")
          .oneOf([Yup.ref("password")], "Passwords must match"),

        remember: Yup.boolean()
          .oneOf([true], "You should agree our terms!")
          .required("You should agree our terms!"),
      }),
    []
  );

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const cleanEmail = values.email.trim().toLowerCase();
      const firstName = values.firstname.trim();
      const lastName = values.lastname.trim();

      const emailPrefix =
        cleanEmail
          .split("@")[0]
          .replace(/[^a-zA-Z0-9_]/g, "_")
          .slice(0, 24) || "user";

      const uniqueUsername = `${emailPrefix}_${Date.now().toString(
        36
      )}_${Math.floor(Math.random() * 10000)}`;

      const signupData = {
        username: uniqueUsername,
        email: cleanEmail,
        password: values.password,
      };

      const res = await api.post("/api/auth/local/register", signupData, {
        skipAuth: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jwt = res.data?.jwt;
      const registeredUser = res.data?.user;

      if (!jwt || !registeredUser?.id) {
        throw new Error("Signup succeeded but login data was not returned");
      }

      let finalUser = {
        ...registeredUser,
        username: registeredUser.username || uniqueUsername,
        email: registeredUser.email || cleanEmail,
        first_name: firstName,
        last_name: lastName,
        avatar: registeredUser.avatar || null,
      };

      try {
        const profileRes = await api.put(
          `/api/users/${registeredUser.id}`,
          {
            first_name: firstName,
            last_name: lastName,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        finalUser = {
          ...finalUser,
          ...(profileRes.data || {}),
          first_name: firstName,
          last_name: lastName,
          avatar: profileRes.data?.avatar || registeredUser.avatar || null,
        };
      } catch (profileErr) {
        console.log(
          "Profile names update after signup failed:",
          profileErr.response?.data || profileErr.message
        );
      }

      syncAuthStorage({
        jwt,
        user: finalUser,
      });

      if (typeof setUser === "function") {
        setUser(finalUser);
      }

      if (typeof useStore.setState === "function") {
        useStore.setState({
          user: finalUser,
          token: jwt,
          jwt,
          authChecked: true,
          isAuthenticated: true,
          loading: false,
        });
      }

      await Swal.fire({
        title: "Account created successfully!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.log("SIGNUP ERROR:", error.response?.data || error.message);

      const backendMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Signup failed";

      const lowerMessage = String(backendMessage).toLowerCase();

      const message =
        lowerMessage.includes("email") ||
        lowerMessage.includes("already") ||
        lowerMessage.includes("taken")
          ? "This email is already registered"
          : backendMessage;

      Swal.fire({
        title: message,
        icon: "error",
        draggable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-[760px] px-1 lg:px-0 lg:self-center flex justify-center items-center h-full">
      <div className="w-full p-0 lg:px-3 flex flex-col gap-[40px]">
        <Formik
          initialValues={{
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            passwordconfirmation: "",
            remember: false,
          }}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          {({ isSubmitting }) => (
            <Form className="w-full flex flex-col gap-[24px]">
              <div className="hidden w-full lg:flex justify-between">
                <div className="w-[280px] flex flex-col gap-[8px]">
                  <label className="text-[#222222] text-[18px] font-semibold">
                    First Name
                  </label>

                  <Field
                    className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                    placeholder="John"
                    name="firstname"
                  />

                  <ErrorMessage
                    name="firstname"
                    component="p"
                    className="text-red-700 px-2 py-2 text-sm"
                  />
                </div>

                <div className="w-[280px] flex flex-col gap-[8px]">
                  <label className="text-[#222222] text-[18px] font-semibold">
                    Last Name
                  </label>

                  <Field
                    className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                    placeholder="Smith"
                    name="lastname"
                  />

                  <ErrorMessage
                    name="lastname"
                    component="p"
                    className="text-red-700 px-2 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="lg:hidden w-full flex flex-col gap-[3px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Name
                </label>

                <div className="w-full flex gap-0">
                  <Field
                    className="w-[50%] text-[16px] text-[#222222] outline-0 h-[54px] border border-[#22222240] border-r-0 text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal px-3 rounded-l-xl"
                    placeholder="John"
                    name="firstname"
                  />

                  <Field
                    className="w-[50%] text-[16px] border border-[#22222240] outline-0 h-[54px] border-l-0 text-[#222222] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal px-3 rounded-r-xl"
                    placeholder="Smith"
                    name="lastname"
                  />
                </div>

                <ErrorMessage
                  name="firstname"
                  component="p"
                  className="text-red-700 px-2 pt-2 text-sm"
                />

                <ErrorMessage
                  name="lastname"
                  component="p"
                  className="text-red-700 px-2 pt-2 text-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-[8px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Email
                </label>

                <Field
                  className="input text-[16px] text-[#222222] w-full h-[54px] border border-[#22222240] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                  placeholder="example@gmail.com"
                  name="email"
                  type="email"
                  autoComplete="email"
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-700 px-2 py-2 text-sm"
                />
              </div>

              <div className="w-full flex flex-col gap-[14px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Password
                </label>

                <div className="relative w-full inline-block">
                  <Field
                    className="z-0 input w-full text-[16px] text-[#222222] h-[54px] bg-[#FFFFFF] border border-[#22222240] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal pr-12"
                    placeholder="**********"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-[27px] lg:top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer z-10"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-700 px-2 text-sm leading-5"
                />

                <p className="text-[#22222280] text-[12px] px-2 -mt-2">
                  Minimum 8 characters, uppercase, lowercase and number.
                </p>

                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Confirm password
                </label>

                <div className="relative w-full">
                  <Field
                    className="z-0 input text-[16px] text-[#222222] w-full border border-[#22222240] h-[54px] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal mb-[10px] pr-12"
                    placeholder="**********"
                    name="passwordconfirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-[27px] lg:top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer z-10"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <ErrorMessage
                  name="passwordconfirmation"
                  component="p"
                  className="text-red-700 px-2 py-2 text-sm"
                />

                <div className="w-full flex justify-between items-center">
                  <section className="w-full text-[16px] text-[#222222] flex items-center gap-[8px]">
                    <Field
                      type="checkbox"
                      id="remember"
                      name="remember"
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />

                    <div className="text-[#222222] w-full flex text-[12px] font-normal select-none">
                      <label htmlFor="remember" className="cursor-pointer">
                        Agree with{" "}
                        <span className="text-orange-600">
                          Terms & Conditions
                        </span>
                      </label>
                    </div>
                  </section>
                </div>

                <ErrorMessage
                  name="remember"
                  component="p"
                  className="text-red-700 px-2 py-2 text-sm"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="hidden lg:block btn w-full h-[48px] bg-[#D9176C] text-[#FFFFFF] font-semibold rounded-xl border-0 mt-[40px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? "Creating account..." : "Sign Up"}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="lg:hidden btn w-full h-[48px] bg-[#D9176C] text-[#FFFFFF] font-semibold rounded-xl border-0 mt-[40px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? "Creating..." : btnName}
                </button>

                <div className="hidden w-full text-[#222222] text-[16px] font-normal lg:flex justify-center mt-[40px]">
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-[#D9176C] text-[16px] font-semibold"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  </p>
                </div>

                <div className="hidden w-full h-[148px] gap-[12px] lg:flex flex-col items-center mt-[40px]">
                  <h5 className="self-center text-[#00000080]">or</h5>

                  <div className="w-full relative">
                    <button
                      type="button"
                      className="btn w-full h-[46px] bg-[#FFFFFF] text-[#222222] text-[14px] font-normal border-0 rounded-xl"
                    >
                      Sign up with Google
                    </button>

                    <FcGoogle className="absolute left-[60px] top-[15px] lg:left-[280px] lg:top-[16px]" />
                  </div>

                  <div className="w-full relative">
                    <button
                      type="button"
                      className="btn w-full h-[46px] bg-[#FFFFFF] text-[#222222] text-[14px] font-normal border-0 rounded-xl"
                    >
                      Sign up with Facebook
                    </button>

                    <FaFacebook className="absolute left-[55px] top-[15px] lg:left-[275px] lg:top-[16px] text-blue-600" />
                  </div>
                </div>

                <div className="lg:hidden w-full h-[148px] gap-[12px] flex flex-col items-center mt-[40px]">
                  <div className="w-full order-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="h-px bg-gray-300" />

                    <span className="lg:hidden text-gray-500 text-sm whitespace-nowrap">
                      {`Or ${lineThrough} with`}
                    </span>

                    <div className="h-px bg-gray-300" />
                  </div>

                  <div className="w-full text-[#222222] text-[16px] font-normal lg:flex justify-items-center">
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-[#D9176C] text-[16px] font-semibold"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </button>
                    </p>
                  </div>

                  <div className="w-full order-3 lg:order-2 flex justify-items-center lg:flex-col justify-between gap-3">
                    <div className="w-full relative">
                      <button
                        type="button"
                        className="lg:hidden btn w-full h-[54px] bg-[#FFFFFF] text-[#222222] text-[16px] font-normal border-0 rounded-xl"
                      >
                        Google
                      </button>

                      <FcGoogle className="absolute w-[22px] h-[22px] left-[25px] top-[16px]" />
                    </div>

                    <div className="w-full relative">
                      <button
                        type="button"
                        className="lg:hidden h-[54px] btn w-full bg-[#FFFFFF] text-[#222222] text-[16px] font-normal border-0 rounded-xl"
                      >
                        Facebook
                      </button>

                      <FaFacebook className="absolute w-[22px] h-[22px] left-[16px] top-[16px] text-blue-600" />
                    </div>
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