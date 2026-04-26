import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";
import api from "../api";
import useStore from "../store/store";
import fallbackAvatar from "../assets/AfterLoginPage/Avatar Image (1).png";
import { normalizeProfileImageFile } from "../utils/imageNormalizer";

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL || "http://163.245.208.70").replace(
    /\/$/,
    ""
  );
}

function getAvatarUrl(avatar) {
  if (!avatar) return fallbackAvatar;

  if (typeof avatar === "string") {
    return avatar.startsWith("http") ? avatar : `${getApiBaseUrl()}${avatar}`;
  }

  const directUrl =
    avatar?.url ||
    avatar?.formats?.thumbnail?.url ||
    avatar?.formats?.small?.url ||
    avatar?.formats?.medium?.url;

  if (!directUrl) return fallbackAvatar;

  return directUrl.startsWith("http")
    ? directUrl
    : `${getApiBaseUrl()}${directUrl}`;
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getTokenFromStorage() {
  const directToken =
    localStorage.getItem("jwt") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  if (directToken) return directToken;

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    const parsed = safeJson(raw);

    if (!parsed || typeof parsed !== "object") continue;

    const state = parsed.state || parsed;

    const token =
      state.jwt ||
      state.token ||
      state.authToken ||
      state.accessToken;

    if (token) return token;
  }

  return "";
}

const profileSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .required("First name is required")
    .min(2, "First name is too short")
    .max(30, "First name is too long"),
  last_name: Yup.string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name is too short")
    .max(30, "Last name is too long"),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: Yup.string().trim().max(30, "Phone is too long"),
  address: Yup.string().trim().max(160, "Address is too long"),
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const user = useStore((state) => state.user);
  const storeToken = useStore((state) => state.token);
  const setUser = useStore((state) => state.setUser);
  const refreshProfileFromApi = useStore(
    (state) => state.refreshProfileFromApi
  );
  const authChecked = useStore((state) => state.authChecked);

  const token = storeToken || getTokenFromStorage();

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageBusy, setImageBusy] = useState(false);

  useEffect(() => {
    if (authChecked && !token) {
      navigate("/login", { replace: true });
    }
  }, [authChecked, navigate, token]);

  useEffect(() => {
    if (token) {
      refreshProfileFromApi?.();
    }
  }, [refreshProfileFromApi, token]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentAvatar = useMemo(() => {
    return previewUrl || getAvatarUrl(user?.avatar);
  }, [previewUrl, user?.avatar]);

  const initialValues = useMemo(
    () => ({
      first_name: user?.first_name || user?.firstName || "",
      last_name: user?.last_name || user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    }),
    [user]
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      toast.error("Please choose a valid image");
      return;
    }

    setImageBusy(true);

    try {
      let finalFile = file;

      try {
        finalFile = await normalizeProfileImageFile(file, {
          maxSize: 900,
          quality: 0.9,
        });
      } catch (normalizeErr) {
        console.log("image normalize failed, using original:", normalizeErr);
        finalFile = file;
      }

      setAvatarFile(finalFile);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const nextPreviewUrl = URL.createObjectURL(finalFile);
      setPreviewUrl(nextPreviewUrl);
    } catch (err) {
      console.log("avatar choose error:", err);
      toast.error("Cannot upload image");
    } finally {
      setImageBusy(false);
    }
  };

  const handleImageChange = handleAvatarChange;

  const uploadAvatarIfNeeded = async () => {
    if (!avatarFile) return null;

    try {
      const formData = new FormData();

      formData.append(
        "files",
        avatarFile,
        avatarFile.name || `avatar-${Date.now()}.jpg`
      );

      const uploadRes = await api.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uploadedFile = Array.isArray(uploadRes?.data)
        ? uploadRes.data[0]
        : uploadRes?.data;

      if (!uploadedFile?.id) {
        throw new Error("Upload response does not contain file id");
      }

      return uploadedFile;
    } catch (err) {
      console.log("UPLOAD ERROR:", err?.response?.data || err.message);
      throw new Error(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Cannot upload image"
      );
    }
  };

  const handleSubmit = async (values, formikHelpers) => {
    if (!user?.id || !token) {
      toast.error("Please login first");
      navigate("/login", { replace: true });
      formikHelpers.setSubmitting(false);
      return;
    }

    try {
      let uploadedAvatar = null;

      if (avatarFile) {
        try {
          uploadedAvatar = await uploadAvatarIfNeeded();
        } catch (uploadErr) {
          toast.error(uploadErr.message || "Cannot upload image");
          formikHelpers.setSubmitting(false);
          return;
        }
      }

      const payload = {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        address: values.address.trim(),
      };

      if (uploadedAvatar?.id) {
        payload.avatar = uploadedAvatar.id;
      }

      const res = await api.put(`/api/users/${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = {
        ...user,
        ...(res?.data || {}),
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        avatar: uploadedAvatar || res?.data?.avatar || user?.avatar,
      };

      setUser?.(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage-update"));

      setAvatarFile(null);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("PROFILE UPDATE ERROR:", error?.response?.data || error.message);

      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Profile update failed";

      toast.error(message);
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  if (!token) return null;

  return (
    <div className="h-full w-full lg:max-w-full mx-auto bg-[#F5F5F5] flex flex-col gap-[10px]">
      <div className="w-full max-w-[760px] mx-auto px-4 lg:px-0 py-[34px] lg:py-[54px]">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="w-full bg-transparent flex flex-col gap-[24px]">
              <div className="w-full flex flex-col items-center gap-[12px] mb-[6px]">
                <div className="relative w-[116px] h-[116px] z-[1]">
                  <img
                    src={currentAvatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover bg-white border-[4px] border-white shadow-[0_12px_35px_rgba(0,0,0,0.12)]"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageBusy || isSubmitting}
                    className="absolute bottom-[3px] right-[3px] w-[38px] h-[38px] rounded-full bg-[#D9176C] text-white flex justify-center items-center border-[2px] border-white shadow-md disabled:opacity-60"
                    aria-label="Change profile photo"
                  >
                    <FaCamera className="text-[15px]" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <h1 className="text-[#222222] text-[24px] lg:text-[30px] font-semibold leading-tight">
                  Update Profile
                </h1>

                {imageBusy && (
                  <span className="text-[#D9176C] text-[13px] font-semibold">
                    Preparing image...
                  </span>
                )}
              </div>

              <div className="hidden w-full lg:flex justify-between">
                <div className="w-[360px] flex flex-col gap-[8px]">
                  <label className="text-[#222222] text-[18px] font-semibold">
                    First Name
                  </label>
                  <Field
                    className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal border border-[#22222240]"
                    placeholder="John"
                    name="first_name"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="p"
                    className="text-red-700 px-2 py-2"
                  />
                </div>

                <div className="w-[360px] flex flex-col gap-[8px]">
                  <label className="text-[#222222] text-[18px] font-semibold">
                    Last Name
                  </label>
                  <Field
                    className="input w-full h-[54px] text-neutral-900 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal border border-[#22222240]"
                    placeholder="Smith"
                    name="last_name"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="p"
                    className="text-red-700 px-2 py-2"
                  />
                </div>
              </div>

              <div className="lg:hidden w-full flex flex-col gap-[3px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Name
                </label>

                <div className="w-full flex gap-0">
                  <Field
                    className="w-[50%] text-[16px] text-[#222222] outline-0 h-[54px] border border-[#22222240] border-r-0 bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal px-3"
                    placeholder="John"
                    name="first_name"
                  />

                  <Field
                    className="w-[50%] text-[16px] border border-[#22222240] outline-0 h-[54px] border-l-0 text-[#222222] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal px-3"
                    placeholder="Smith"
                    name="last_name"
                  />
                </div>

                <ErrorMessage
                  name="first_name"
                  component="p"
                  className="text-red-700 px-2 py-2"
                />
                <ErrorMessage
                  name="last_name"
                  component="p"
                  className="text-red-700 px-2 py-2"
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
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-700 px-2 py-2"
                />
              </div>

              <div className="w-full flex flex-col gap-[8px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Phone
                </label>
                <Field
                  className="input text-[16px] text-[#222222] w-full h-[54px] border border-[#22222240] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal"
                  placeholder="Phone"
                  name="phone"
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="text-red-700 px-2 py-2"
                />
              </div>

              <div className="w-full flex flex-col gap-[8px]">
                <label className="text-[16px] lg:text-[18px] font-semibold text-[#222222]">
                  Address
                </label>
                <Field
                  as="textarea"
                  className="input text-[16px] text-[#222222] w-full min-h-[104px] border border-[#22222240] bg-[#FFFFFF] placeholder:text-[#13131333] placeholder:text-[16px] placeholder:font-normal resize-none py-3"
                  placeholder="Address"
                  name="address"
                />
                <ErrorMessage
                  name="address"
                  component="p"
                  className="text-red-700 px-2 py-2"
                />
              </div>

              <div className="w-full flex flex-col gap-[12px] mt-[24px]">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn w-full h-[48px] bg-[#FFFFFF] text-[#D9176C] font-semibold rounded-xl border border-[#D9176C]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || imageBusy}
                  className="btn w-full h-[48px] bg-[#D9176C] text-[#FFFFFF] font-semibold rounded-xl border-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}