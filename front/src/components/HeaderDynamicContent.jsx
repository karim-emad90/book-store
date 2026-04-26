import { useLocation } from "react-router-dom";
import { FiMic } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";

export default function HeaderDynamicContent({ search, setSearch }) {
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === "/" || path === "/beforelogin";
  const isAbout = path === "/about";
  const isProfile = path === "/profile";

  return (
    <>
      {isHome && (
        <div className="absolute inset-0 z-[20] hidden lg:flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto mt-[70px] flex h-[54px] w-full max-w-[640px] overflow-hidden rounded-full bg-white shadow-[0_14px_40px_rgba(0,0,0,0.22)]">
            <input
              type="text"
              value={search || ""}
              onChange={(e) => setSearch?.(e.target.value)}
              placeholder="Search"
              className="h-full flex-1 bg-white px-[22px] text-[20px] text-[#2A2A2A] outline-none placeholder:text-[#9E9E9E]"
            />

            <button
              type="button"
              className="flex w-[54px] items-center justify-center bg-white text-[#B8B8B8]"
            >
              <FiMic className="text-[20px]" />
            </button>

            <button
              type="button"
              className="flex w-[54px] items-center justify-center bg-[#D9176C] text-white"
            >
              <IoSearch className="text-[22px]" />
            </button>
          </div>
        </div>
      )}

      {isAbout && (
        <div className="absolute inset-0 z-[20] hidden lg:flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="mb-[16px] text-[48px] font-bold">About Bookshop</h1>
          <p className="max-w-[650px] text-[20px] leading-relaxed text-white/90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et
            ultricies est. Aliquam in justo varius, sagittis neque ut,
            malesuada leo.
          </p>
        </div>
      )}

      {isProfile && null}
    </>
  );
}