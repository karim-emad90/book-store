import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import toast, { Toaster } from "react-hot-toast";
import useStore from "./store/store";
import { LoginRequiredToast } from "./utils/featureGuard.jsx";

export default function App() {
  const initializeAuth = useStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handler = () => {
      toast.custom(
        (t) => <LoginRequiredToast t={t} />,
        {
          id: "bookshop-login-required",
          duration: 6500,
          position: "top-center",
        }
      );
    };

    window.addEventListener("bookshop-login-required", handler);

    return () => {
      window.removeEventListener("bookshop-login-required", handler);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 999999 }}
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 999999,
          },
        }}
      />

      <div className="w-full min-h-dvh bg-[#F5F5F5]">
        <AppRoutes />
      </div>
    </>
  );
}