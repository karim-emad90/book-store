import { useEffect, useMemo, useState } from "react";
import shippingIcon from "../assets/cart/shipping-fast 1.png";
import trashIcon from "../assets/cart/trash (1) 1.png";
import ticket from "../assets/cart/ticket (2) 1.png";
import { getBookImage } from "../utils/getBookCategoryImage";
import { getCart, removeFromCart, changeCartQty } from "../utils/store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function MyCart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => getCart());

  const DISCOUNT_KEY = "bookshop_discount";

  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [code, setCode] = useState("");

  const normalizeCode = (value = "") => value.trim().toLowerCase();

  const syncCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    syncCart();

    const handleSync = () => syncCart();

    window.addEventListener("storage-update", handleSync);
    window.addEventListener("bookshop-localstorage-change", handleSync);
    window.addEventListener("cart-updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("storage-update", handleSync);
      window.removeEventListener("bookshop-localstorage-change", handleSync);
      window.removeEventListener("cart-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const showDiscountSuccessToast = () => {
    toast.success("Discount code applied", {
      duration: 3000,
      style: {
        background: "#2A1634",
        color: "#FFFFFF",
        border: "1px solid rgba(217,23,108,0.25)",
        borderRadius: "16px",
        padding: "12px 16px",
        fontWeight: "600",
      },
    });
  };

  const showDiscountErrorToast = () => {
    toast.error("Sorry, invalid discount code!", {
      duration: 3000,
      style: {
        background: "#2A1634",
        color: "#FFFFFF",
        border: "1px solid rgba(217,23,108,0.25)",
        borderRadius: "16px",
        padding: "12px 16px",
        fontWeight: "600",
      },
    });
  };

  const getCartItemImage = (item) => {
    return (
      item?.image ||
      item?.imgSrc ||
      item?.coverImageFullUrl ||
      getBookImage(item)
    );
  };

  const getCartItemKey = (item) => {
    return String(
      item?.documentId ||
        item?.id ||
        item?._id ||
        item?.isbn13 ||
        item?.isbn ||
        item?.slug ||
        item?.title ||
        ""
    );
  };

  const getItemPrice = (item) => Number(item?.price || 0);
  const getItemQty = (item) => Number(item?.qty || item?.quantity || 1);
  const getItemTotal = (item) => getItemPrice(item) * getItemQty(item);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  }, [cartItems]);

  const tax = useMemo(() => {
    return cartItems.length ? 4 : 0;
  }, [cartItems.length]);

  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const finalTotal = Math.max(total - discount, 0);

  const persistDiscountCode = (value) => {
    localStorage.setItem(DISCOUNT_KEY, JSON.stringify({ code: value }));
  };

  const cartHasMatchingCode = (enteredCode) => {
    return cartItems.some(
      (item) => normalizeCode(item.discountCode) === enteredCode
    );
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DISCOUNT_KEY) || "null");
      if (saved?.code) {
        const savedCode = normalizeCode(saved.code);
        setAppliedCode(savedCode);
        setCode(savedCode);
      }
    } catch {}
  }, []);

  const applyDiscount = () => {
    const entered = normalizeCode(code);

    if (!entered || !cartHasMatchingCode(entered)) {
      setDiscount(0);
      setAppliedCode("");
      localStorage.removeItem(DISCOUNT_KEY);
      showDiscountErrorToast();
      return;
    }

    const discountAmount = total * 0.25;

    setDiscount(discountAmount);
    setAppliedCode(entered);
    setCode(entered);
    persistDiscountCode(entered);

    showDiscountSuccessToast();
  };

  const removeDiscount = () => {
    setDiscount(0);
    setAppliedCode("");
    setCode("");
    localStorage.removeItem(DISCOUNT_KEY);
  };

  useEffect(() => {
    if (!appliedCode) {
      setDiscount(0);
      return;
    }

    if (!cartHasMatchingCode(appliedCode)) {
      removeDiscount();
      return;
    }

    const discountAmount = total * 0.25;
    setDiscount(discountAmount);
    persistDiscountCode(appliedCode);
  }, [appliedCode, cartItems, total]);

  const handleRemove = (item) => {
    const nextCart = removeFromCart(item);
    setCartItems(nextCart);

    if (!nextCart.length) {
      removeDiscount();
    }
  };

  const handleDecrease = (item) => {
    const nextQty = getItemQty(item) - 1;
    const nextCart =
      nextQty <= 0 ? removeFromCart(item) : changeCartQty(item, nextQty);

    setCartItems(nextCart);

    if (!nextCart.length) {
      removeDiscount();
    }
  };

  const handleIncrease = (item) => {
    const nextCart = changeCartQty(item, getItemQty(item) + 1);
    setCartItems(nextCart);
  };

  if (!cartItems.length) {
    return (
      <div className="w-full bg-[#F5F5F5] px-4 py-10 lg:px-[60px] lg:py-[50px]">
        <div className="mx-auto max-w-[1100px] rounded-[24px] bg-white p-8 text-center shadow-sm">
          <h2 className="text-[28px] font-bold text-[#222222]">
            Your cart is empty
          </h2>
          <p className="mt-3 text-[15px] text-[#22222280]">
            Add some books to your cart and they will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/books")}
            className="mt-6 h-[46px] rounded-[12px] bg-[#D9176C] px-6 text-white font-semibold hover:opacity-90 transition"
          >
            Keep Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lg:hidden w-full bg-[#F5F5F5] px-4 pt-4 pb-24 flex flex-col gap-4">
        {cartItems.map((item, index) => (
          <div
            key={`${getCartItemKey(item)}-${index}`}
            className="bg-white rounded-2xl p-3 shadow-sm border border-[#22222210] relative"
          >
            <button
              type="button"
              className="absolute top-3 right-3"
              onClick={() => handleRemove(item)}
            >
              <img src={trashIcon} className="w-5 h-5" alt="Remove" />
            </button>

            <div className="flex gap-3">
              <img
                src={getCartItemImage(item)}
                alt={item.title}
                className="w-[90px] h-[120px] object-cover rounded-xl"
              />

              <div className="flex-1 flex flex-col">
                <h3 className="text-[16px] font-semibold text-[#222222] line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-[13px] text-[#22222280]">{item.author}</p>

                <p className="text-[12px] text-[#22222280] line-clamp-2 mt-1">
                  {item.description}
                </p>

                <p className="mt-2 text-[16px] font-semibold text-[#222222]">
                  ${getItemPrice(item).toFixed(2)}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#D9176C] text-[#D9176C]"
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </button>

                  <span className="text-[16px] text-[#222222] font-semibold">
                    {getItemQty(item)}
                  </span>

                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[#D9176C] text-[#D9176C]"
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 text-[14px] text-[#D9176C] font-semibold">
                  Total: ${getItemTotal(item).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 mt-2 flex flex-col gap-3">
          <p className="flex justify-between items-center text-[14px]">
            <span className="text-xl font-semibold text-[#D9176C]">
              Subtotal
            </span>
            <span className="text-l font-semibold text-[#222222]">
              ${subtotal.toFixed(2)}
            </span>
          </p>

          <p className="flex justify-between text-[14px]">
            <span className="text-xl font-semibold text-[#D9176C]">Tax</span>
            <span className="text-l font-semibold text-[#222222]">${tax}</span>
          </p>

          {discount > 0 && (
            <p className="flex justify-between text-[14px] text-[#D9176C]">
              <span>Discount (25%)</span>
              <span>- ${discount.toFixed(2)}</span>
            </p>
          )}

          <p className="flex justify-between text-[16px] font-bold">
            <span className="text-xl font-semibold text-[#D9176C]">Total</span>
            <span className="text-l font-bold text-yellow-500">
              ${finalTotal.toFixed(2)}
            </span>
          </p>

          <button
            type="button"
            className="w-full h-11 bg-[#D9176C] text-white rounded-xl mt-2"
            onClick={() => navigate("/checkout")}
          >
            Check out
          </button>

          <button
            type="button"
            className="w-full h-11 border border-[#D9176C] text-[#D9176C] rounded-xl"
            onClick={() => navigate("/books")}
          >
            Keep Shopping
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 mt-2">
          <p className="text-xl font-semibold text-[#D9176C]">
            Have a discount code?
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={!!appliedCode}
              placeholder="Enter code"
              className={`flex-1 h-11 px-3 rounded-xl border outline-none text-[14px] placeholder:text-xl ${
                appliedCode
                  ? "text-[#22222266] border-[#22222222]"
                  : "text-[#222222] border-[#22222233]"
              }`}
            />

            <button
              type="button"
              onClick={applyDiscount}
              disabled={!!appliedCode}
              className={`px-4 h-11 rounded-xl text-white text-[14px] ${
                appliedCode ? "bg-[#D9176C66]" : "bg-[#D9176C]"
              }`}
            >
              Apply
            </button>
          </div>

          {appliedCode && (
            <button
              type="button"
              onClick={removeDiscount}
              className="h-10 text-[#D9176C] border border-[#D9176C] rounded-xl text-[14px]"
            >
              Remove Code
            </button>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="w-full h-full pt-[60px] flex flex-col gap-[40px] bg-[#F5F5F5]">
          <div className="w-full flex gap-[427px] pl-[148px] pr-[270px] text-[20px] text-[#000000] font-semibold">
            <h3>Item</h3>

            <div className="w-full flex gap-[176px]">
              <div className="w-full flex gap-[139px]">
                <h3>Quantity</h3>
                <h3>Price</h3>
              </div>

              <h3 className="w-full flex">Total Price</h3>
            </div>
          </div>

          <div className="w-full flex flex-col gap-[8px]">
            {cartItems.map((item, index) => (
              <div
                key={`${getCartItemKey(item)}-${index}`}
                className="w-full flex gap-[25px] items-center px-[60px] p-[24px] bg-[#FFFFFF] relative"
              >
                <div className="w-[535px] flex gap-[24px]">
                  <img
                    src={getCartItemImage(item)}
                    className="h-full w-[173px]"
                    alt={item.title}
                  />

                  <div className="w-full flex flex-col gap-[35px]">
                    <div className="w-[251px] flex flex-col gap-[8px]">
                      <div className="w-full flex flex-col">
                        <h3 className="text-[18px] text-[#222222] font-bold">
                          {item.title}
                        </h3>
                        <p className="text-[14px] text-[#222222]">
                          <span className="text-[14px] text-[#22222280]">
                            Author:
                          </span>
                          {item.author}
                        </p>
                      </div>

                      <p className="w-full text-[14px] text-[#22222280]">
                        {item.description?.slice(0, 120) || "No description."}
                      </p>
                    </div>

                    <div className="w-full flex flex-col gap-[32px]">
                      <button
                        type="button"
                        className="w-[138px] h-[35px] flex justify-center items-center gap-[3px] bg-[#FFFFFF] text-[#22222280] text-[14px] rounded-xl border border-[#22222233]"
                      >
                        <img src={shippingIcon} alt="shippingIcon" />
                        Free Shipping
                      </button>

                      <p className="text-[14px] text-[#22222280]">
                        <span className="text-[14px] text-[#22222280] font-bold">
                          ASIN:
                        </span>{" "}
                        {item.isbn13 || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-[400px] items-center flex gap-[144px]">
                  <div className="w-[86px] items-center flex gap-[6.5px]">
                    <button
                      type="button"
                      className="w-[20px] h-[20px] flex justify-center items-center text-[#D9176C] font-semibold bg-[#FFFFFF] rounded-full border border-[#D9176C]"
                      onClick={() => handleDecrease(item)}
                    >
                      -
                    </button>
                    <h2 className="text-[#222222] text-[24px] font-semibold">
                      {getItemQty(item)}
                    </h2>
                    <button
                      type="button"
                      className="w-[20px] h-[20px] flex justify-center items-center text-[#D9176C] font-semibold bg-[#FFFFFF] rounded-full border border-[#D9176C]"
                      onClick={() => handleIncrease(item)}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-[30px] text-[#000000] font-semibold">
                    {getItemPrice(item).toFixed(2)}
                  </p>
                  <p className="text-[30px] text-[#000000] font-semibold">
                    {getItemTotal(item).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    className="absolute top-[46%] right-[10%] w-[24px] h-[24px] bg-transparent border-0"
                    onClick={() => handleRemove(item)}
                  >
                    <img
                      src={trashIcon}
                      className="w-[24px] h-[24px]"
                      alt="Remove"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full px-[112px] py-[40px] mb-[120px] flex gap-[156px] bg-[#3b2f4a1a]">
            <div className="flex flex-col gap-[80px]">
              <div className="w-full flex flex-col gap-[16px]">
                <h4 className="text-[26px] text-[#222222] font-bold">
                  Payment Summary
                </h4>
                <p className="w-[516px] text-[16px] text-[#22222280]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris et ultricies est. Aliquam in justo varius, sagittis
                  neque ut, malesuada leo
                </p>
              </div>

              <div className="w-full flex flex-col gap-[24px]">
                <p className="text-[#22222280] text-[18px]">
                  Have a discount code?
                </p>

                <div className="w-full flex flex-col gap-[10px]">
                  <div className="w-full flex gap-[12px] items-center">
                    <div className="w-[284px] relative">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={!!appliedCode}
                        className={`outline-0 w-full h-[52px] pl-[53px] pr-[16px] text-[16px] rounded-xl border bg-transparent ${
                          appliedCode
                            ? "text-[#22222266] border-[#22222222]"
                            : "text-[#22222280] border-[#22222233]"
                        }`}
                        placeholder="Enter Promo Code"
                      />
                      <img
                        src={ticket}
                        className="absolute top-[16px] left-[24px]"
                        alt=""
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyDiscount}
                      disabled={!!appliedCode}
                      className={`h-[52px] px-[22px] rounded-xl text-[16px] font-semibold border-0 transition ${
                        appliedCode
                          ? "bg-[#D9176C66] text-white cursor-not-allowed"
                          : "bg-[#D9176C] text-white hover:opacity-90 active:scale-[0.99]"
                      }`}
                    >
                      Apply
                    </button>

                    {appliedCode && (
                      <button
                        type="button"
                        onClick={removeDiscount}
                        className="h-[52px] px-[18px] rounded-xl text-[16px] font-semibold bg-transparent text-[#D9176C] border border-[#D9176C] hover:bg-[#D9176C0D] transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-[40px]">
              <div className="w-full flex flex-col gap-[24px]">
                <div className="w-full flex flex-col gap-[24px] border-b border-[#22222233] pb-[24px]">
                  <p className="w-full flex justify-between text-[24px] text-[#222222] font-semibold">
                    <span className="text-[20px] text-[#22222280]">
                      Subtotal
                    </span>
                    ${subtotal.toFixed(2)}
                  </p>
                  <p className="w-full flex justify-between text-[24px] text-[#222222] font-semibold">
                    <span className="text-[20px] text-[#22222280]">
                      Shipping
                    </span>
                    Free Delivery
                  </p>
                  <p className="w-full flex justify-between text-[24px] text-[#222222] font-semibold">
                    <span className="text-[20px] text-[#22222280]">Tax</span>
                    ${tax}
                  </p>
                </div>

                <p className="flex justify-between text-[28px] text-[#D9176C] font-bold">
                  <span className="text-[20px] text-[#22222280] font-semibold">
                    Total
                  </span>
                  <span>${total.toFixed(2)}</span>
                </p>

                {discount > 0 && (
                  <p className="flex justify-between text-[22px] text-[#222222] font-semibold">
                    <span className="text-[20px] text-[#22222280] font-semibold">
                      Discount (25%)
                    </span>
                    <span className="text-[#D9176C]">
                      - ${discount.toFixed(2)}
                    </span>
                  </p>
                )}

                <p className="flex justify-between text-[30px] text-[#222222] font-bold">
                  <span className="text-[20px] text-[#22222280] font-semibold">
                    Final Total
                  </span>
                  <span>${finalTotal.toFixed(2)}</span>
                </p>
              </div>

              <div className="w-full flex flex-col gap-[12px]">
                <button
                  type="button"
                  className="btn w-full h-[48px] text-[16px] font-semibold bg-[#D9176C] rounded-xl border-0"
                  onClick={() => navigate("/checkout")}
                >
                  Check out
                </button>
                <button
                  type="button"
                  className="btn w-full h-[48px] text-[16px] font-semibold bg-transparent rounded-xl text-[#D9176C] border border-[#D9176C]"
                  onClick={() => navigate("/books")}
                >
                  Keep Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
