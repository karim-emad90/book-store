import toast from "react-hot-toast";
import {
  IoBagHandleOutline,
  IoLockClosedOutline,
  IoLogInOutline,
} from "react-icons/io5";

const TOAST_ID = "bookshop-login-required-feature";

export function showLoginRequiredFeatureToast() {
  toast.custom(
    (t) => (
      <div
        className={`pointer-events-auto w-[calc(100vw-32px)] max-w-[430px] overflow-hidden rounded-[22px] border border-[#ffffff14] bg-[#2A1634] shadow-[0_22px_60px_rgba(0,0,0,0.35)] transition-all duration-300 ${
          t.visible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-2 opacity-0 scale-[0.98]"
        }`}
      >
        <div className="relative overflow-hidden px-5 py-5 sm:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,23,108,0.22),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_32%)]" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#D9176C]/18 ring-1 ring-[#ffffff12]">
              <IoLockClosedOutline className="text-[24px] text-[#FF8DBD]" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-semibold leading-tight text-white">
                Login required
              </h3>

              <p className="mt-2 text-[13px] leading-6 text-white/75">
                You need to login first to use these features.
              </p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    toast.dismiss(t.id);
                    window.location.assign("/login");
                  }}
                  className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#D9176C] px-5 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(217,23,108,0.32)] transition hover:opacity-90"
                >
                  <IoLogInOutline className="text-[18px]" />
                  Login Page
                </button>

                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 text-[13px] font-medium text-white/90 transition hover:bg-white/10"
                >
                  <IoBagHandleOutline className="text-[17px]" />
                  Keep Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      id: TOAST_ID,
      duration: 5000,
      position: "top-center",
    }
  );
}