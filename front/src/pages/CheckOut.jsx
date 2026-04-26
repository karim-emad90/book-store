import { Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import pencil from "../assets/CheckoutPage/fi-rr-pencil.png";
import ticket from "../assets/CheckoutPage/ticket (2) 1 (1).png";
import MobileFooter from "../components/MobileFooter";
import { getCart, addToCart, changeCartQty } from "../utils/store";
import * as Yup from "yup";
import { ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getBookImage } from "../utils/getBookCategoryImage";

export const checkoutSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  town: Yup.string().required("State is required"),

  phone: Yup.string()
    .matches(/^01[0-9]{9}$/, "Phone must be a valid Egyptian number")
    .required("Phone is required"),

  city: Yup.string().required("City is required"),

  postalcode: Yup.string()
    .matches(/^[0-9]{5}$/, "Postal code must be 5 digits")
    .required("Postal code is required"),

  address: Yup.string()
    .min(10, "Address is too short")
    .required("Address is required"),

  notes: Yup.string().max(200, "Note must be less than 200 characters"),
});

const initialValues = {
  name: "",
  email: "",
  town: "",
  phone: "",
  city: "",
  postalcode: "",
  address: "",
  notes: "",
};

export default function CheckOut() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState("cash");
  const [cartItems, setCartItems] = useState(() => getCart());

  const DISCOUNT_KEY = "bookshop_discount";

  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [code, setCode] = useState("");

  const options = [
    { id: "online", label: "Online payment" },
    { id: "cash", label: "Cash on delivery" },
    { id: "pos", label: "POS on delivery" },
  ];

  const normalizeCode = (value = "") => value.trim().toLowerCase();

  const syncCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    syncCart();

    const handleSync = () => syncCart();

    window.addEventListener("storage-update", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("storage-update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const getItemPrice = (item) => Number(item?.price || 0);
  const getItemQty = (item) => Number(item?.qty || 1);
  const getItemTotal = (item) => getItemPrice(item) * getItemQty(item);

  const getCartItemImage = (item) => {
    return item?.image || item?.imgSrc || item?.coverImageFullUrl || getBookImage(item);
  };

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

  const showFormErrorToast = () => {
    toast.error("Please fill all required fields", {
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

  const showEmptyCartToast = () => {
    toast.error("Your cart is empty", {
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

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  }, [cartItems]);

  const tax = useMemo(() => {
    return cartItems.length ? 4 : 0;
  }, [cartItems.length]);

  const shipping = 0;

  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);
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

  const handleDecrease = (item) => {
    changeCartQty(item.id, getItemQty(item) - 1);
    syncCart();
  };

  const handleIncrease = async (item) => {
    await addToCart({ ...item, documentId: item.id });
    syncCart();
  };

  const clearCartAfterOrder = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("bookshop_cart");
    localStorage.removeItem(DISCOUNT_KEY);

    setCartItems([]);
    setDiscount(0);
    setAppliedCode("");
    setCode("");

    window.dispatchEvent(new Event("storage-update"));
  };

  const showOverlayToast = () => {
    toast.custom(
      (t) => (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative bg-white rounded-[28px] px-10 py-12 text-center w-full max-w-[380px] shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-[90px] h-[90px] rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-[40px] font-bold">✓</span>
              </div>
            </div>

            <h2 className="text-[28px] font-semibold text-[#222] mb-2">
              Successful!
            </h2>

            <p className="text-[16px] text-gray-500 mb-8">
              Your order has been confirmed
            </p>

            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/books");
              }}
              className="w-full h-[56px] bg-[#D9176C] hover:bg-pink-700 text-white rounded-xl text-[16px] font-semibold"
            >
              Keep shopping
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const handleConfirmOrder = (isValid) => {
    if (!isValid) {
      showFormErrorToast();
      return;
    }

    if (!cartItems.length) {
      showEmptyCartToast();
      return;
    }

    clearCartAfterOrder();
    showOverlayToast();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={checkoutSchema}
      onSubmit={() => {}}
      validateOnMount
    >
      {({ isValid }) => (
        <Form className="w-full">
          <div className="w-full h-full py-[30px] px-[16px] sm:py-[60px] sm:px-[50px] flex flex-col gap-[24px] bg-[#F5F5F5]">
            <div className="w-full flex flex-col lg:flex-row gap-[24px]">
              <div className="w-full lg:w-[760px] p-[20px] sm:p-[40px] rounded-xl bg-[#FFFFFF] flex flex-col gap-[24px]">
                <div className="w-full flex flex-col gap-[40px]">
                  <h3 className="text-[18px] text-[#222222] font-semibold">
                    Shipping information
                  </h3>

                  <div className="w-full flex flex-col gap-[24px]">
                    <div className="w-full flex flex-col sm:flex-row gap-[16px]">
                      <div className="w-full sm:w-[332px] flex flex-col gap-[24px]">
                        <div className="flex flex-col gap-[10px]">
                          <h4 className="text-[14px] text-[#22222280]">Name</h4>
                          <Field
                            name="name"
                            className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                            placeholder="John Smith"
                          />
                          <ErrorMessage
                            name="name"
                            component="p"
                            className="text-red-500 text-[12px]"
                          />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                          <h4 className="text-[14px] text-[#22222280]">Email</h4>
                          <Field
                            name="email"
                            className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                            placeholder="Johnsmith@gmail.com"
                          />
                          <ErrorMessage
                            name="email"
                            component="p"
                            className="text-red-500 text-[12px]"
                          />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                          <h4 className="text-[14px] text-[#22222280]">State</h4>
                          <Field
                            name="town"
                            className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                            placeholder="Cairo"
                          />
                          <ErrorMessage
                            name="town"
                            component="p"
                            className="text-red-500 text-[12px]"
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-[332px] flex flex-col gap-[24px]">
                        <div className="flex flex-col gap-[10px]">
                          <h4 className="text-[14px] text-[#22222280]">Phone</h4>
                          <Field
                            name="phone"
                            className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                            placeholder="01012345678"
                          />
                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="text-red-500 text-[12px]"
                          />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                          <h4 className="text-[14px] text-[#22222280]">City</h4>
                          <Field
                            name="city"
                            className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                            placeholder="Maadi"
                          />
                          <ErrorMessage
                            name="city"
                            component="p"
                            className="text-red-500 text-[12px]"
                          />
                        </div>

                        <div className="flex flex-col gap-[10px]">
                          <h4 className="text-[14px] text-[#22222280]">Zip</h4>
                          <Field
                            name="postalcode"
                            className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                            placeholder="11311"
                          />
                          <ErrorMessage
                            name="postalcode"
                            component="p"
                            className="text-red-500 text-[12px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <h4 className="text-[14px] text-[#22222280]">Address</h4>
                      <Field
                        name="address"
                        className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder:text-[#222222]"
                        placeholder="Maadi, Cairo, Egypt."
                      />
                      <ErrorMessage
                        name="address"
                        component="p"
                        className="text-red-500 text-[12px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-[40px]">
                  <h4 className="text-[18px] font-semibold text-[#222222]">
                    Payment Method
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[25px]">
                    {options.map((option) => {
                      const isActive = selected === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelected(option.id)}
                          className={`w-full sm:w-[210px] h-[54px] flex items-center justify-center gap-[8px] rounded-xl cursor-pointer ${
                            isActive
                              ? "bg-[#FCE7F3] border border-[#EC4899]"
                              : "border border-[#E5E5E5]"
                          }`}
                        >
                          <div
                            className={`${
                              isActive
                                ? "border-[4px] border-[#EC4899]"
                                : "border border-[#222]"
                            } w-[16px] h-[16px] rounded-full`}
                          />
                          <span
                            className={`${
                              isActive ? "text-[#EC4899]" : "text-[#222]"
                            }`}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-[40px]">
                  <h3 className="text-[18px] text-[#222222] font-semibold">
                    Note
                  </h3>

                  <div className="relative">
                    <img src={pencil} className="absolute left-5 top-5" alt="" />
                    <Field
                      as="textarea"
                      name="notes"
                      className="w-full h-[150px] sm:h-[180px] pl-[45px] pr-[38px] pt-4 border border-[#22222233] resize-none text-[#222222] placeholder:text-[#22222280]"
                      placeholder="Add note"
                    />
                    <ErrorMessage
                      name="notes"
                      component="p"
                      className="text-red-500 text-[12px]"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[536px] p-[20px] sm:p-[40px] rounded-xl bg-white flex flex-col gap-[40px]">
                <div className="flex flex-col gap-[40px]">
                  <h3 className="text-[18px] font-semibold text-[#222222]">
                    Order summary
                  </h3>

                  <div className="flex flex-col gap-[24px] sm:gap-[40px]">
                    {cartItems.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]"
                      >
                        <img
                          src={getCartItemImage(item)}
                          alt={item.title || "Book image"}
                          className="w-[90px] h-[130px] sm:w-[111px] sm:h-[160px] object-cover mx-auto sm:mx-0"
                        />

                        <div className="flex flex-col gap-[12px] sm:gap-[15px] w-full">
                          <div className="flex flex-col gap-[12px] sm:gap-[16px] text-center sm:text-left">
                            <h4 className="text-[14px] sm:text-[16px] font-bold text-[#222222]">
                              {item.title}
                            </h4>
                            <p className="text-[12px] sm:text-[14px] text-[#222222]">
                              <span className="text-[#22222280]">Author: </span>
                              {item.author}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-center gap-[10px]">
                            <h3 className="text-[18px] sm:text-[24px] font-bold text-[#222222]">
                              ${getItemTotal(item).toFixed(2)}
                            </h3>

                            <div className="flex gap-[6px] items-center">
                              <button
                                type="button"
                                className="w-[18px] h-[18px] flex items-center justify-center border border-[#D9176C] rounded-full text-[#D9176C]"
                                onClick={() => handleDecrease(item)}
                              >
                                -
                              </button>

                              <p className="text-[24px] font-semibold text-[#222222]">
                                {getItemQty(item)}
                              </p>

                              <button
                                type="button"
                                className="w-[18px] h-[18px] flex items-center justify-center border border-[#D9176C] rounded-full text-[#D9176C]"
                                onClick={() => handleIncrease(item)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-[40px]">
                  <div className="flex flex-col gap-[16px]">
                    <p className="text-[#22222280]">Have a discount code?</p>

                    <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px]">
                      <div className="w-full sm:w-[352px] relative">
                        <img
                          src={ticket}
                          className="absolute top-[16px] left-3"
                          alt=""
                        />
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          disabled={!!appliedCode}
                          className={`w-full h-[52px] pl-[40px] border border-[#22222233] placeholder:text-[#22222280] rounded-xl ${
                            appliedCode
                              ? "text-[#22222266] border-[#22222222]"
                              : "text-[#22222280] border-[#22222233]"
                          }`}
                          placeholder="Enter Promo Code"
                        />
                      </div>

                      <button
                        type="button"
                        className={`w-full sm:w-[88px] h-[52px] font-semibold text-white rounded-xl ${
                          appliedCode
                            ? "bg-[#D9176C66] cursor-not-allowed"
                            : "bg-[#D9176C] hover:opacity-90 active:scale-[0.99]"
                        }`}
                        onClick={applyDiscount}
                        disabled={!!appliedCode}
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCode && (
                      <button
                        type="button"
                        onClick={removeDiscount}
                        className="w-full h-[48px] rounded-xl border border-[#D9176C] text-[#D9176C] font-semibold hover:bg-[#D9176C0D] transition"
                      >
                        Remove Code
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-[20px]">
                    <p className="flex justify-between text-[#222222] font-semibold">
                      <span className="text-[#22222280] text-[16px] font-semibold">
                        Subtotal
                      </span>
                      ${subtotal.toFixed(2)}
                    </p>

                    <p className="flex justify-between text-[#222222] font-semibold">
                      <span className="text-[#22222280] text-[16px] font-semibold">
                        Tax
                      </span>
                      ${tax}
                    </p>

                    <p className="flex justify-between text-[#22222280] font-semibold">
                      <span className="text-[#22222280] text-[16px] font-semibold">
                        Shipping
                      </span>
                      Free Delivery
                    </p>

                    <p className="flex justify-between text-[#222222] font-semibold">
                      <span className="text-[#22222280] text-[16px] font-semibold">
                        Total (USD)
                      </span>
                      <span className="text-[#D9176C]">${total.toFixed(2)}</span>
                    </p>

                    {discount > 0 && (
                      <p className="flex justify-between text-[#222222] font-semibold">
                        <span className="text-[#22222280] text-[16px] font-semibold">
                          Discount (25%)
                        </span>
                        <span className="text-[#D9176C]">
                          - ${discount.toFixed(2)}
                        </span>
                      </p>
                    )}

                    <div className="flex justify-between border-t border-[#22222233] pt-3">
                      <p className="text-[20px] text-[#22222280] font-semibold">
                        Final Total (USD)
                      </p>
                      <p className="text-[#D9176C] text-[26px] font-semibold">
                        ${finalTotal.toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!isValid}
                      onClick={() => handleConfirmOrder(isValid)}
                      className={`w-full h-[48px] text-[16px] font-semibold text-white rounded-xl ${
                        isValid
                          ? "bg-[#D9176C]"
                          : "bg-[#D9176C66] cursor-not-allowed opacity-50"
                      }`}
                    >
                      Confirm order
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </Form>
      )}
    </Formik>
  );
}