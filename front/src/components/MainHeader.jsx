import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import bookIcon from "../assets/LoginPage/book-bookmark 1.png";
import BigLibrary from "../assets/HomPage/big-library.png";
import fallbackAvatar from "../assets/AfterLoginPage/Avatar Image (1).png";
import { FaMicrophone } from "react-icons/fa";
import { CiSearch, CiHeart } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { FiLogOut, FiUser } from "react-icons/fi";
import useStore from "../store/store";
import { getCartCount, getFavCount } from "../utils/store";

function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL || "http://163.245.208.70").replace(/\/$/, "");
}

function getAvatarUrl(avatar) {
  if (!avatar) return fallbackAvatar;

  if (typeof avatar === "string") {
    return avatar.startsWith("http") ? avatar : `${getApiBaseUrl()}${avatar}`;
  }

  const directUrl = avatar?.url || avatar?.formats?.thumbnail?.url || avatar?.formats?.small?.url;

  if (!directUrl) return fallbackAvatar;
  return directUrl.startsWith("http") ? directUrl : `${getApiBaseUrl()}${directUrl}`;
}

function getUserId(user) {
  return user?.id || user?.documentId || user?._id || null;
}

function getUserIdentifiers(user) {
  return [
    user?.id,
    user?.documentId,
    user?._id,
    user?.email,
    user?.username,
  ]
    .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
    .map((value) => String(value).trim().toLowerCase());
}

function safeJsonParse(value) {
  if (!value || typeof value !== "string") return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function wordMatch(text, words) {
  const normalized = String(text || "").toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function getItemUserIdentifiers(item) {
  if (!item || typeof item !== "object") return [];

  return [
    item.userId,
    item.user_id,
    item.ownerId,
    item.owner_id,
    item.customerId,
    item.customer_id,
    item.accountId,
    item.account_id,
    item.createdBy,
    item.created_by,
    item.email,
    item.userEmail,
    item.user_email,
    item.username,
    item.userName,
    item.user_name,
    item.user?.id,
    item.user?.documentId,
    item.user?.email,
    item.user?.username,
    item.customer?.id,
    item.customer?.email,
    item.owner?.id,
    item.owner?.email,
  ]
    .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
    .map((value) => String(value).trim().toLowerCase());
}

function itemBelongsToUser(item, userIdentifiers) {
  const itemIdentifiers = getItemUserIdentifiers(item);

  if (!itemIdentifiers.length) {
    return true;
  }

  return itemIdentifiers.some((id) => userIdentifiers.includes(id));
}

function getCartQuantity(item) {
  if (!item || typeof item !== "object") return 1;

  const rawQuantity =
    item.quantity ??
    item.qty ??
    item.count ??
    item.amount ??
    item.pivot?.quantity ??
    item.meta?.quantity;

  const quantity = Number(rawQuantity);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function countArrayItems(array, type, userIdentifiers) {
  const ownedItems = array.filter((item) => itemBelongsToUser(item, userIdentifiers));

  if (type === "cart") {
    return ownedItems.reduce((total, item) => total + getCartQuantity(item), 0);
  }

  return ownedItems.length;
}

function countPlainObjectItems(object, type, userIdentifiers) {
  if (!object || typeof object !== "object" || Array.isArray(object)) return 0;

  const ignoredKeys = new Set([
    "state",
    "version",
    "token",
    "user",
    "users",
    "byuser",
    "byusers",
    "total",
    "subtotal",
    "discount",
    "shipping",
    "loading",
    "error",
    "authchecked",
    "lastupdated",
    "updatedat",
    "createdat",
  ]);

  const values = Object.entries(object).filter(([key]) => !ignoredKeys.has(key.toLowerCase()));
  if (!values.length) return 0;

  const objectValues = values.map(([, value]) => value);
  const looksLikeItemMap = objectValues.every(
    (value) => value && typeof value === "object" && !Array.isArray(value)
  );

  if (!looksLikeItemMap) return 0;

  const ownedItems = objectValues.filter((item) => itemBelongsToUser(item, userIdentifiers));

  if (type === "cart") {
    return ownedItems.reduce((total, item) => total + getCartQuantity(item), 0);
  }

  return ownedItems.length;
}

function countFromValue(value, type, userIdentifiers, path = "", matchedPath = false, depth = 0) {
  if (depth > 8 || value === null || value === undefined) return 0;

  const words =
    type === "cart"
      ? ["cart", "basket"]
      : ["favorite", "favorites", "favourite", "favourites", "wishlist", "wish", "heart", "bookmark", "like"];

  const pathMatched = matchedPath || wordMatch(path, words);

  if (typeof value === "string") {
    const parsed = safeJsonParse(value);
    if (parsed === value) return 0;
    return countFromValue(parsed, type, userIdentifiers, path, pathMatched, depth + 1);
  }

  if (Array.isArray(value)) {
    return pathMatched ? countArrayItems(value, type, userIdentifiers) : 0;
  }

  if (typeof value !== "object") return 0;

  if (pathMatched) {
    for (const userKey of userIdentifiers) {
      const directKey = Object.keys(value).find((key) => String(key).trim().toLowerCase() === userKey);
      if (directKey) {
        const directCount = countFromValue(value[directKey], type, userIdentifiers, `${path}.${directKey}`, true, depth + 1);
        if (directCount > 0) return directCount;
      }
    }
  }

  const childCounts = [];

  for (const [key, childValue] of Object.entries(value)) {
    const nextPath = path ? `${path}.${key}` : key;
    const count = countFromValue(childValue, type, userIdentifiers, nextPath, pathMatched, depth + 1);
    if (count > 0) childCounts.push(count);
  }

  if (childCounts.length) return Math.max(...childCounts);

  if (pathMatched) {
    return countPlainObjectItems(value, type, userIdentifiers);
  }

  return 0;
}

function readLocalStorageCount(type, user) {
  if (typeof window === "undefined") return 0;

  const userIdentifiers = getUserIdentifiers(user);
  if (!userIdentifiers.length) return 0;

  let bestCount = 0;

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key) continue;

      const lowerKey = key.toLowerCase();
      const isClearlyAuthKey =
        lowerKey.includes("auth") ||
        lowerKey === "token" ||
        lowerKey === "jwt" ||
        lowerKey === "user" ||
        lowerKey === "bookshop-user";

      const keyLooksRelevant =
        type === "cart"
          ? wordMatch(lowerKey, ["cart", "basket", "store"])
          : wordMatch(lowerKey, ["favorite", "favourite", "wishlist", "wish", "heart", "bookmark", "like", "store"]);

      if (isClearlyAuthKey && !keyLooksRelevant) continue;

      const parsed = safeJsonParse(localStorage.getItem(key));
      const count = countFromValue(parsed, type, userIdentifiers, key, keyLooksRelevant, 0);
      if (count > bestCount) bestCount = count;
    }
  } catch (error) {
    console.error("Failed to read header counters:", error);
  }

  return bestCount;
}

function useUserLocalCounts(user, isLoggedIn) {
  const userId = getUserId(user);
  const [counts, setCounts] = useState({ cart: 0, favorites: 0 });

  useEffect(() => {
    let disposed = false;

    const updateCounts = () => {
      if (disposed) return;

      if (!isLoggedIn || !userId) {
        setCounts({ cart: 0, favorites: 0 });
        return;
      }

      const nextCounts = {
        cart: Number(getCartCount?.() ?? readLocalStorageCount("cart", user)) || 0,
        favorites: Number(getFavCount?.() ?? readLocalStorageCount("favorites", user)) || 0,
      };

      setCounts((prev) =>
        prev.cart === nextCounts.cart && prev.favorites === nextCounts.favorites ? prev : nextCounts
      );
    };

    updateCounts();

    window.addEventListener("storage", updateCounts);
    window.addEventListener("storage-update", updateCounts);
    window.addEventListener("bookshop-localstorage-change", updateCounts);
    window.addEventListener("cart-updated", updateCounts);
    window.addEventListener("favorites-updated", updateCounts);
    window.addEventListener("favourites-updated", updateCounts);
    window.addEventListener("wishlist-updated", updateCounts);
    window.addEventListener("focus", updateCounts);
    document.addEventListener("visibilitychange", updateCounts);

    const intervalId = window.setInterval(updateCounts, 250);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("storage-update", updateCounts);
      window.removeEventListener("bookshop-localstorage-change", updateCounts);
      window.removeEventListener("cart-updated", updateCounts);
      window.removeEventListener("favorites-updated", updateCounts);
      window.removeEventListener("favourites-updated", updateCounts);
      window.removeEventListener("wishlist-updated", updateCounts);
      window.removeEventListener("focus", updateCounts);
      document.removeEventListener("visibilitychange", updateCounts);
    };
  }, [isLoggedIn, userId, user]);

  return counts;
}

function NavItem({ to, children, light = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-[#EAA451] hover:text-[#EAA451]"
          : light
          ? "text-white hover:text-[#F8D2E3]"
          : "text-[#222222] hover:text-[#D9176C]"
      }
    >
      {children}
    </NavLink>
  );
}

function CounterBadge({ children, value, light = false, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center justify-center"
      aria-label={label}
    >
      {children}
      <span
        className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[10px] leading-none border ${
          light
            ? "bg-white text-[#D9176C] border-[#D9176C]"
            : "bg-[#D9176C] text-white border-white"
        }`}
      >
        {value}
      </span>
    </button>
  );
}

export default function MainHeader({ search = "", setSearch, mobileSimple = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.user);
  const token = useStore((state) => state.token);
  const logout = useStore((state) => state.logout);

  const isLoggedIn = Boolean(token && user);
  const { cart, favorites } = useUserLocalCounts(user, isLoggedIn);

  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const isBooksPage = location.pathname === "/books";
  const isHeroPage = ["/", "/beforelogin", "/afterlogin", "/about"].includes(location.pathname);
  const isProfilePage = location.pathname === "/profile";

  const desktopHeight = isProfilePage ? "338px" : isHeroPage ? "804px" : "120px";
  const showDesktopSearch = isHeroPage && !isBooksPage && location.pathname !== "/about";
  const showBooksMobileSearch = isBooksPage && !mobileSimple;
  const showNormalMobileHeader = !showBooksMobileSearch;

  const avatarUrl = useMemo(() => getAvatarUrl(user?.avatar), [user?.avatar]);
  const displayName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "User";
  const displayEmail = user?.email || "";

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      const clickedTrigger = dropdownRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const handleSearchChange = (event) => {
    if (typeof setSearch === "function") {
      setSearch(event.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/", { replace: true });
  };

  const openProfileMenu = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setOpenMenu((prev) => !prev);
  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block w-full relative overflow-hidden" style={{ height: desktopHeight }}>
        <div className="relative z-20 w-full h-[92px] bg-white/20 flex items-center justify-between px-4 lg:px-[140px]">
          <div className="w-full flex gap-[48px]">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden lg:flex items-center gap-[10px] text-white"
            >
              <img src={bookIcon} alt="Bookshop" className="w-[28px]" />
              <span className="text-[16px] font-light">Bookshop</span>
            </button>

            <div className="hidden lg:flex gap-[40px] text-white text-[18px] no-underline font-semibold">
              <NavItem to="/" light>
                Home
              </NavItem>
              <NavItem to="/books" light>
                Books
              </NavItem>
              <NavItem to="/about" light>
                About US
              </NavItem>
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="flex items-center gap-[10px]">
              <button
                type="button"
                className="btn h-[40px] px-4 bg-[#D9176C] border-0 text-white"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="btn h-[40px] px-4 bg-white text-[#D9176C] border border-[#D9176C]"
              >
                Signup
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[24px] text-white">
              <CounterBadge value={favorites} onClick={() => navigate("/wishlist")} label="Wishlist">
                <CiHeart className="text-4xl" />
              </CounterBadge>

              <CounterBadge value={cart} onClick={() => navigate("/cart")} label="Cart">
                <IoCartOutline className="text-4xl" />
              </CounterBadge>

              <div ref={dropdownRef} className="relative flex gap-[10px] items-center">
                <button
                  type="button"
                  className="relative w-[40px] h-[40px] rounded-full focus:outline-none focus:ring-2 focus:ring-[#D9176C]"
                  onClick={openProfileMenu}
                  aria-label="Open profile menu"
                >
                  <img
                    src={avatarUrl}
                    className="w-full h-full rounded-full object-cover bg-white"
                    alt="User avatar"
                  />
                  <span className="absolute top-0 right-0 w-[9.6px] h-[9.6px] bg-green-600 rounded-full border-[2px] border-white" />
                </button>

                <button type="button" onClick={openProfileMenu} className="w-full flex flex-col gap-[4px] text-left">
                  <h3 className="text-[16px] text-[#FFFFFF] leading-5 max-w-[145px] truncate">{displayName}</h3>
                  <p className="text-[14px] text-[#ffffff80] leading-4 max-w-[170px] truncate">{displayEmail}</p>
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${BigLibrary})` }}
        >
          {showDesktopSearch && (
            <div className="flex relative justify-self-center top-[50%] w-full lg:w-[536px] z-20 h-[59px]">
              <div className="relative w-full">
                <input
                  type="text"
                  value={search || ""}
                  onChange={handleSearchChange}
                  className="h-full text-black text-xl w-full bg-white rounded-l-4xl rounded-r-0 placeholder:text-[#22222280] placeholder:text-[20px] px-7 pr-14"
                  placeholder="Search"
                />
                <FaMicrophone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-2xl" />
              </div>

              <button type="button" className="h-full w-[70px] bg-[#D9176C] rounded-r-4xl rounded-l-0 flex items-center justify-center">
                <CiSearch className="text-white text-2xl font-semibold" />
              </button>
            </div>
          )}
        </div>

        {location.pathname === "/about" && (
          <div className="hidden lg:absolute inset-0 z-10 w-full lg:flex flex-col gap-[16px] justify-center items-center bg-black/30 pointer-events-none">
            <h1 className="flex justify-center text-[48px] text-[#FFFFFF] font-bold">About Bookshop</h1>
            <p className="w-[652px] text-[24px] text-[#FFFFFF] mx-auto leading-relaxed text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo
              varius, sagittis neque ut, malesuada leo.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Header for all pages except Books search header */}
      {showNormalMobileHeader && (
        <div className="lg:hidden sticky top-0 z-[99990] w-full bg-[#43264F] text-white shadow-md">
          <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
            <button type="button" className="flex items-center gap-2 shrink-0" onClick={() => navigate("/")}>
              <img src={bookIcon} className="w-[24px]" alt="Bookshop" />
              <span className="text-[18px] font-semibold">Bookshop</span>
            </button>

            <div className="flex items-center gap-3 shrink-0">
              {isLoggedIn ? (
                <>
                  <CounterBadge value={favorites} onClick={() => navigate("/wishlist")} label="Wishlist">
                    <CiHeart className="text-[27px] text-white" />
                  </CounterBadge>

                  <CounterBadge value={cart} onClick={() => navigate("/cart")} label="Cart">
                    <IoCartOutline className="text-[27px] text-white" />
                  </CounterBadge>

                  <button
                    ref={dropdownRef}
                    type="button"
                    className="relative w-[38px] h-[38px] rounded-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
                    onClick={openProfileMenu}
                    aria-label="Open profile menu"
                  >
                    <img src={avatarUrl} className="w-full h-full rounded-full object-cover bg-white" alt="User avatar" />
                    <span className="absolute top-0 right-0 w-[9px] h-[9px] bg-green-600 rounded-full border-[2px] border-white" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="h-[34px] px-3 rounded-full bg-[#D9176C] text-white text-[12px] font-semibold"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="h-[34px] px-3 rounded-full bg-white text-[#D9176C] text-[12px] font-semibold"
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="h-px w-full bg-white/10 mb-3" />
            <div className="flex items-center justify-center gap-4 text-[14px] font-medium">
              <button type="button" className="hover:text-[#F8D2E3] transition" onClick={() => navigate("/")}>Home</button>
              <span className="h-4 w-px bg-white/20" />
              <button type="button" className="hover:text-[#F8D2E3] transition" onClick={() => navigate("/books")}>Books</button>
              <span className="h-4 w-px bg-white/20" />
              <button type="button" className="hover:text-[#F8D2E3] transition" onClick={() => navigate("/about")}>About Us</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Books Header only */}
      {showBooksMobileSearch && (
        <div className="lg:hidden w-full flex gap-[16px] items-center px-4 pt-[18px] pb-[10px] bg-[#F5F5F5]">
          <div className="w-full flex h-[38px]">
            <div className="w-full relative">
              <input
                type="text"
                value={search || ""}
                onChange={handleSearchChange}
                className="outline-0 pl-[16px] pr-[36px] w-full h-full border border-r-0 rounded-r-0 rounded-l-xl border-[#22222233] bg-[#FFFFFF] text-[16px] text-black placeholder:text-[#22222233] placeholder:text-[12px]"
                placeholder="Search"
              />
              <FaMicrophone className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00000080] cursor-pointer text-xl" />
            </div>

            <button type="button" className="flex justify-center items-center w-[46px] h-[38px] outline-0 bg-[#FFFFFF] border border-l-0 rounded-r-3xl border-[#22222233]">
              <CiSearch className="w-[14px] h-[14px] text-[#D9176C]" />
            </button>
          </div>

          {isLoggedIn && (
            <div className="w-[88px] flex gap-[8px] items-center">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative flex justify-center items-center rounded-full w-[40px] h-[40px] bg-[#D9176C] text-white"
                aria-label="Cart"
              >
                <IoCartOutline className="w-[16px] h-[16px]" />
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-white text-[#D9176C] text-[9px] border border-[#D9176C] flex items-center justify-center">
                  {cart}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/wishlist")}
                className="relative flex justify-center items-center rounded-full w-[40px] h-[40px] bg-[#FFFFFF] border border-[#D9176C]"
                aria-label="Wishlist"
              >
                <CiHeart className="w-[16px] h-[16px] text-[#D9176C]" />
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#D9176C] text-white text-[9px] border border-white flex items-center justify-center">
                  {favorites}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {isLoggedIn && openMenu && (
        <div
          ref={menuRef}
          className="fixed top-[78px] right-4 lg:right-[140px] z-[999999] w-[260px] rounded-2xl bg-white shadow-2xl border border-[#22222214] overflow-hidden"
        >
          <div className="p-4 flex items-center gap-3 bg-[#D9176C]">
            <img src={avatarUrl} className="w-[46px] h-[46px] rounded-full object-cover bg-white border border-white" alt="User avatar" />
            <div className="min-w-0">
              <h4 className="text-white text-[15px] font-semibold truncate">{displayName}</h4>
              <p className="text-white/75 text-[12px] truncate">{displayEmail}</p>
            </div>
          </div>

          <div className="p-2 bg-white">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#222222] hover:bg-[#F5F5F5] transition"
              onClick={() => {
                setOpenMenu(false);
                navigate("/profile");
              }}
            >
              <FiUser className="text-[18px] text-[#D9176C]" />
              <span className="text-[14px] font-medium">Update Profile</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#222222] hover:bg-[#F5F5F5] transition"
              onClick={handleLogout}
            >
              <FiLogOut className="text-[18px] text-[#D9176C]" />
              <span className="text-[14px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
