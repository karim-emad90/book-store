import { Field, Form, Formik } from "formik";
import { useEffect, useMemo,  useState } from "react";
import pencil from "../assets/CheckoutPage/fi-rr-pencil.png"
import richdad from "../assets/LoginPage/richdadbook.png"
import van from "../assets/ProductDetails/shipping-fast 1 (1).png"
import ticket from "../assets/CheckoutPage/ticket (2) 1 (1).png"
import design from "../assets/SliderBooks/designbook.png"
import MobileFooter from "../components/MobileFooter";
import {
  getCart,
  addToCart,
  changeCartQty
} from "../utils/store";
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

  town: Yup.string()
    .required("State is required"),

  phone: Yup.string()
    .matches(/^01[0-9]{9}$/, "Phone must be a valid Egyptian number")
    .required("Phone is required"),

  city: Yup.string()
    .required("City is required"),

  postalcode: Yup.string()
    .matches(/^[0-9]{5}$/, "Postal code must be 5 digits")
    .required("Postal code is required"),

  address: Yup.string()
    .min(10, "Address is too short")
    .required("Address is required"),

  notes: Yup.string()
    .max(200, "Note must be less than 200 characters"),
});

export default function CheckOut() {
  const [selected, setSelected] = useState("cash");

  const options = [
    { id: "online", label: "Online payment" },
    { id: "cash", label: "Cash on delivery" },
    { id: "pos", label: "POS on delivery" },
  ];

  const orders = [
    {bookImg:richdad,bookTitle:'Rich Dad And Poor Dad', bookAuthor:'Robert T. Kiyosanki', totalPrice:'40',qty:'1'},
    {bookImg:design,bookTitle:'The Design Of Every Day Things', bookAuthor:'Don Norman', totalPrice:'70',qty:'3'}
  ]

  const [cartItems,setCartItems] = useState(() => getCart());

  const DISCOUNT_KEY = "bookshop_discount";
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [code,setCode] = useState('');



  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DISCOUNT_KEY) || "null");
      if (saved?.discount > 0 && saved?.code) {
        setDiscount(saved.discount);
        setAppliedCode(saved.code);
        setCode(saved.code);
        setMsg({ type: "success", text: "Discount code applied ✅" });
      }
    } catch {}
  }, []);

  const subtotal = useMemo(() => {
      return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    }, [cartItems]);
  
    const tax = useMemo(() => {
      return 4;
    }, [subtotal]);
  
    const shipping = 0;
  
    const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping]);
    const finalTotal = total - discount;
  const applyDiscount = () => {
  // ✅ تمنع تطبيقه مرتين
  if (appliedCode) {
    setMsg({ type: "error", text: "Discount already applied." });
    return;
  }

  const entered = code.trim().toLowerCase();
  if (!entered) {
    setMsg({ type: "error", text: "Please enter a promo code." });
    return;
  }

   const matchedItem = cartItems.find(
      (item) => (item.discountCode || "").trim().toLowerCase() === entered
    );
  
    if (!matchedItem) {
      setDiscount(0);
      setMsg({ type: "error", text: "Invalid discount code." });
      return;
    }
  
    // ✅ خصم 25% من إجمالي الكتاب المطابق
    const bookTotal = matchedItem.price * matchedItem.qty;
    const discountAmount = bookTotal * 0.25;
  
    setDiscount(discountAmount);
    setAppliedCode(entered);
    setMsg({ type: "success", text: "Discount applied successfully ✅" });
  
    localStorage.setItem(
      DISCOUNT_KEY,
      JSON.stringify({ code: entered, discount: discountAmount })
    );
  };
  
  const removeDiscount = () => {
    setDiscount(0);
    setAppliedCode("");
    setCode("");
    setMsg({ type: "", text: "" });
    localStorage.removeItem(DISCOUNT_KEY);
  };
  
  useEffect(() => {
    if (!appliedCode) return;
  
    const matchedItem = cartItems.find(
      (item) => (item.discountCode || "").trim().toLowerCase() === appliedCode
    );
  
    if (!matchedItem) {
      // الكتاب اتشال من الكارت → شيل الخصم
      removeDiscount();
      return;
    }
  
    const bookTotal = matchedItem.price * matchedItem.qty;
    const discountAmount = bookTotal * 0.25;
  
    setDiscount(discountAmount);
    localStorage.setItem(DISCOUNT_KEY, JSON.stringify({ code: appliedCode, discount: discountAmount }));
  }, [cartItems, appliedCode]);


const [isShippingValid, setIsShippingValid] = useState(false);

const navigate = useNavigate();

const showOverlayToast = () => {
  toast.custom(
    (t) => (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center`}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* الخلفية */}
        <div className="absolute  inset-0 bg-black/50"></div>

        {/* الكارد */}
        <div className="relative bg-white rounded-[28px] px-10 py-12 text-center w-full  shadow-2xl lg:w-[380px]">
          
          {/* الدائرة الخضرا */}
          <div className="flex justify-center mb-6">
            <div className="w-[90px] h-[90px] rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-[40px] font-bold">✓</span>
            </div>
          </div>

          {/* العنوان */}
          <h2 className="text-[28px] font-semibold text-[#222] mb-2">
            Successful!
          </h2>

          {/* الوصف */}
          <p className="text-[16px] text-gray-500 mb-8">
            Your order has been confirmed
          </p>

          {/* الزرار */}
          <button
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
      position: "top-center", // مهم
    }
  );
};
  return (
    <div className="w-full h-full py-[30px] px-[16px] sm:py-[60px] sm:px-[50px] flex flex-col lg:flex-row gap-[24px] bg-[#F5F5F5]">

      {/* Shipping */}
      <Formik
       initialValues={{
    name: "",
    email: "",
    town: "",
    phone: "",
    city: "",
    postalcode: "",
    address: "",
    notes: "",
  }}
  validationSchema={checkoutSchema}
  onSubmit={(values) => {
    console.log(values);
  }}
  validateOnMount>
    {({ isValid }) => {
    useEffect(() => {
  setIsShippingValid(isValid);
}, [isValid]);


    return(
        <Form className="w-full lg:w-[760px] p-[20px] sm:p-[40px] rounded-xl bg-[#FFFFFF] flex flex-col gap-[24px]">

          <div className="w-full flex flex-col gap-[40px]">
            <h3 className="text-[18px] text-[#222222] font-semibold">Shipping information</h3>

            <div className="w-full flex flex-col gap-[24px]">

              <div className="w-full flex flex-col sm:flex-row gap-[16px]">

                {/* left */}
                <div className="w-full sm:w-[332px] flex flex-col gap-[24px]">

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Name</h4>
                    <Field name="name" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="John Smith" />
                      <ErrorMessage
    name="name"
    component="p"
    className="text-red-500 text-[12px]"
  />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Email</h4>
                    <Field name="email" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Johnsmith@gmail.com" />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-[12px]" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">State</h4>
                    <Field name="town" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Cairo" />
                    <ErrorMessage name="town" component="p" className="text-red-500 text-[12px]" />
                  </div>

                </div>

                {/* right */}
                <div className="w-full sm:w-[332px] flex flex-col gap-[24px]">

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Phone</h4>
                    <Field name="phone" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="123456789" />
                    <ErrorMessage name="phone" component="p" className="text-red-500 text-[12px]" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">City</h4>
                    <Field name="city" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Maadi" />
                    <ErrorMessage name="city" component="p" className="text-red-500 text-[12px]" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Zip</h4>
                    <Field name="postalcode" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="11311" />
                    <ErrorMessage name="postalcode" component="p" className="text-red-500 text-[12px]" />
                  </div>

                </div>

              </div>

              <div className="flex flex-col gap-[10px]">
                <h4 className="text-[14px] text-[#22222280]">Address</h4>
                <Field name="address" className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Maadi, Cairo, Egypt." />
                <ErrorMessage name="address" component="p" className="text-red-500 text-[12px]" />
              </div>

            </div>
          </div>

          {/* Payment */}
          <div className="flex flex-col gap-[40px]">
            <h4 className="text-[18px] font-semibold text-[#222222]">Payment Method</h4>

            <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[25px]">

              {options.map((option) => {
                const isActive = selected === option.id;

                return (
                  <div
                    key={option.id}
                    onClick={() => setSelected(option.id)}
                    className={`w-full sm:w-[210px] h-[54px] flex items-center justify-center gap-[8px] rounded-xl cursor-pointer
                    ${isActive ? "bg-[#FCE7F3] border border-[#EC4899]" : "border border-[#E5E5E5]"}`}
                  >
                    <div className={`${isActive ? "border-[4px] border-[#EC4899]" : "border border-[#222]"} w-[16px] h-[16px] rounded-full`} />
                    <span className={`${isActive ? "text-[#EC4899]" : "text-[#222]"}`}>{option.label}</span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-[40px]">
            <h3 className="text-[18px] text-[#222222] font-semibold">Note</h3>

            <div className="relative">
              <img src={pencil} className="absolute left-5 top-5" />
              <Field
                as="textarea"
                name="notes"
                className="w-full h-[150px] sm:h-[180px] pl-[45px] pr-[38px] pt-4 border border-[#22222233] resize-none text-[#222222]
                           placeholder:text-[#22222280]"
                placeholder="Add note"
              />
              <ErrorMessage name="notes" component="p" className="text-red-500 text-[12px]" />
            </div>

          </div>

        </Form>
        );}}
      </Formik>

      {/* Order Summary */}
 <Formik
  initialValues={{
    name: "",
    email: "",
    town: "",
    phone: "",
    city: "",
    postalcode: "",
    address: "",
    notes: "",
  }}
  validationSchema={checkoutSchema}
  onSubmit={(values) => {
  // هنا المفروض تبعت order للـ API

  // 🧹 امسح الكارت
  localStorage.removeItem("cart");

  // 🔥 التوست
  toast.custom((t) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-[320px]">
      
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl">✓</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold">Successful!</h3>
      <p className="text-gray-500 mb-4">
        Your order has been confirmed
      </p>

      <button
        onClick={() => {
          toast.dismiss(t.id);
          navigate("/books");
        }}
        className="w-full bg-pink-600 text-white py-2 rounded-lg"
      >
        Keep shopping
      </button>
    </div>
  ));
}}
  validateOnMount
>
  {({ isValid, dirty }) => (
    <Form className="w-full lg:w-[536px] p-[20px] sm:p-[40px] rounded-xl bg-white flex flex-col gap-[40px] lg:gap-[222px]">

      <div className="flex flex-col gap-[40px]">
        <h3 className="text-[18px] font-semibold text-[#222222]">Order summary</h3>

        <div className="flex flex-col gap-[24px] sm:gap-[40px]">

          {cartItems.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">

              <img
  src={item.image || getBookImage(item)}
  alt={item.title || "Book image"}
  className="w-[90px] h-[130px] sm:w-[111px] sm:h-[160px] object-cover mx-auto sm:mx-0"
/>

              <div className="flex flex-col gap-[12px] sm:gap-[15px] w-full">

                <div className="flex flex-col gap-[12px] sm:gap-[16px] text-center sm:text-left">
                  <h4 className="text-[14px] sm:text-[16px] font-bold text-[#222222]">{item.title}</h4>
                  <p className="text-[12px] sm:text-[14px] text-[#222222]">
                    <span className="text-[#22222280]">Author: </span>
                    {item.author}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-[10px]">
                  <h3 className="text-[18px] sm:text-[24px] font-bold text-[#222222]">${item.price * item.qty}</h3>

                  <div className="flex gap-[6px] items-center">
                    <button
                      className="w-[18px] h-[18px] flex items-center justify-center border border-[#D9176C] rounded-full text-[#D9176C]"
                      onClick={(e) => {
                        e.preventDefault();
                        changeCartQty(item.id, item.qty - 1);
                        setCartItems(getCart());
                      }}
                    >
                      -
                    </button>

                    <p className="text-[24px] font-semibold sm:text-[24px] text-[#222222]">{item.qty}</p>

                    <button
                      className="w-[18px] h-[18px] flex items-center justify-center border border-[#D9176C] rounded-full text-[#D9176C]"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({ ...item, documentId: item.id });
                        setCartItems(getCart());
                      }}
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

      {/* Promo */}
      <div className="flex flex-col gap-[40px]">

        <div className="flex flex-col gap-[16px]">
          <p className="text-[#22222280]">Have a discount code?</p>

          <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px]">

            <div className="w-full sm:w-[352px] relative">
              <img src={ticket} className="absolute top-[16px] left-3" />
              <Field
                name="code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (msg.text) setMsg({ type: "", text: "" });
                }}
                disabled={!!appliedCode}
                className={`w-full h-[52px] pl-[40px] border border-[#22222233] placeholder:text-[#22222280]
                  ${appliedCode ? "text-[#22222266] border-[#22222222]" : "text-[#22222280] border-[#22222233]"}`}
                placeholder="Enter Promo Code"
              />
            </div>

            <button
              type="button"
              className={`w-full sm:w-[88px] h-[52px] font-semibold bg-[#3b2f4a] text-white rounded-xl
                ${appliedCode ? "bg-[#D9176C66] cursor-not-allowed" : "bg-[#D9176C] hover:opacity-90 active:scale-[0.99]"}`}
              onClick={applyDiscount}
              disabled={!!appliedCode}
            >
              Apply
            </button>

            {msg.text && (
              <div
                className={`w-full text-[14px] font-semibold px-[12px] py-[10px] rounded-xl border
                  ${msg.type === "success"
                    ? "text-[#1C7C54] border-[#1C7C5433] bg-[#1C7C540D]"
                    : "text-[#B42318] border-[#B4231833] bg-[#B423180D]"}`}
              >
                {msg.text}
              </div>
            )}

          </div>
        </div>

        {/* totals */}
        <div className="flex flex-col gap-[20px]">
          <p className="flex justify-between text-[#222222] font-semibold">
            <span className="text-[#22222280] text-[16px] font-semibold">Subtotal</span>
            ${subtotal.toFixed(2)}
          </p>

          <p className="flex justify-between text-[#222222] font-semibold">
            <span className="text-[#22222280] text-[16px] font-semibold">Tax</span>
            ${tax}
          </p>

          <p className="flex justify-between text-[#22222280] font-semibold">
            <span className="text-[#22222280] text-[16px] font-semibold">Shipping</span>
            Free Delivery
          </p>

          <div className="flex justify-between border-t border-[#22222233] pt-3">
            <p className="text-[20px] text-[#22222280] font-semibold">Total (USD)</p>
            <p className="text-[#D9176C] text-[26px] font-semibold">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>

<button
  type="button" // ❗ بدل submit
  disabled={!isShippingValid}
  onClick={
    () => {
  if (!isShippingValid) {
    toast.error("Please fill all required fields");
    return;
  }

  showOverlayToast(navigate);
}
  }
  className={`w-full h-[48px] text-[16px] font-semibold text-white rounded-xl
    ${
      isShippingValid
        ? "bg-[#D9176C]"
        : "bg-[#D9176C66] cursor-not-allowed opacity-50"
    }`}
>
  Confirm order
</button>

      </div>

    </Form>
  )}
</Formik>
       <MobileFooter/>
    </div>
  )
}