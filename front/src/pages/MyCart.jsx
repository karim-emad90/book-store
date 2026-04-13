import richDadBook from '../assets/LoginPage/richdadbook.png'
import { useEffect, useMemo, useState } from "react";
import shippingIcon from "../assets/cart/shipping-fast 1.png";
import trashIcon from "../assets/cart/trash (1) 1.png";
import ticket from "../assets/cart/ticket (2) 1.png";
import { getBookImage } from "../utils/getBookCategoryImage";

import {
  getCart,
  addToCart,
  removeFromCart,
  changeCartQty,
} from "../utils/store";
import { Navigate, useNavigate } from 'react-router-dom';

export default function MyCart() {
   const [cartItems, setCartItems] = useState(() => getCart());
   const DISCOUNT_KEY = "bookshop_discount";

const [discount, setDiscount] = useState(0);
const [appliedCode, setAppliedCode] = useState("");
const [msg, setMsg] = useState({ type: "", text: "" });
const [code, setCode] = useState("");

const navigate = useNavigate();

// ✅ load saved discount on mount
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

  useEffect(() => {
    const update = () => setCartItems(getCart());
    window.addEventListener("storage-update", update);
    return () => window.removeEventListener("storage-update", update);
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
  return (
    <>
      <div className="lg:hidden w-full bg-[#F5F5F5] px-4 pt-4 pb-24 flex flex-col gap-4">

  {cartItems.map((item) => (
    <div
      key={item.id}
      className="bg-white rounded-2xl p-3 shadow-sm border border-[#22222210] relative"
    >
      {/* Trash */}
      <button
        className="absolute top-3 right-3"
        onClick={() => removeFromCart(item.id)}
      >
        <img src={trashIcon} className="w-5 h-5" />
      </button>

      <div className="flex gap-3">
        <img
          src={getBookImage(item)}
          className="w-[90px] h-[120px] object-cover rounded-xl"
        />

        <div className="flex-1 flex flex-col">
          <h3 className="text-[16px] font-semibold text-[#222222] line-clamp-1">
            {item.title}
          </h3>

          <p className="text-[13px] text-[#22222280]">
            {item.author}
          </p>

          <p className="text-[12px] text-[#22222280] line-clamp-2 mt-1">
            {item.description}
          </p>

          {/* Price */}
          <p className="mt-2 text-[16px] font-semibold text-[#222222]">
            ${item.price.toFixed(2)}
          </p>

          {/* Quantity */}
          <div className="mt-2 flex items-center gap-3">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full border border-[#D9176C] text-[#D9176C]"
              onClick={() => changeCartQty(item.id, item.qty - 1)}
            >
              -
            </button>

            <span className="text-[16px] text-[#222222] font-semibold">
              {item.qty}
            </span>

            <button
              className="w-7 h-7 flex items-center justify-center rounded-full border border-[#D9176C] text-[#D9176C]"
              onClick={() => addToCart({ ...item, documentId: item.id })}
            >
              +
            </button>
          </div>

          {/* Total */}
          <p className="mt-2 text-[14px] text-[#D9176C] font-semibold">
            Total: ${(item.price * item.qty).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  ))}

  {/* Summary */}
  <div className="bg-white rounded-2xl p-4 mt-2 flex flex-col gap-3">
    <p className="flex justify-between items-center text-[14px]">
      <span className='text-xl font-semibold text-[#D9176C]'>Subtotal</span>
      <span className='text-l font-semibold text-[#222222]'>${subtotal.toFixed(2)}</span>
    </p>

    <p className="flex justify-between text-[14px]">
      <span className='text-xl font-semibold text-[#D9176C]'>Tax</span>
      <span className='text-l font-semibold text-[#222222]'>${tax}</span>
    </p>

    {discount > 0 && (
      <p className="flex justify-between text-[14px] text-[#D9176C]">
        <span>Discount</span>
        <span>- ${discount.toFixed(2)}</span>
      </p>
    )}

    <p className="flex justify-between text-[16px] font-bold">
      <span className='text-xl font-semibold text-[#D9176C]'>Total</span>
      <span className='text-l font-bold text-yellow-500'>${finalTotal.toFixed(2)}</span>
    </p>

    <button
      className="w-full h-11 bg-[#D9176C] text-white rounded-xl mt-2"
      onClick={() => navigate('/checkout')}
    >
      Check out
    </button>
  </div>
  {/* Discount Code */}
<div className="bg-white rounded-2xl p-4 flex flex-col gap-3 mt-2">
  <p className="text-xl font-semibold text-[#D9176C]">
    Have a discount code?
  </p>

  <div className="flex gap-2">
    <input
      type="text"
      value={code}
      onChange={(e) => {
        setCode(e.target.value);
        if (msg.text) setMsg({ type: "", text: "" });
      }}
      disabled={!!appliedCode}
      placeholder="Enter code"
      className={`flex-1 h-11 px-3 rounded-xl border outline-none text-[14px] placeholder:text-xl
        ${
          appliedCode
            ? "text-[#22222266] border-[#22222222]"
            : "text-[#222222] border-[#22222233]"
        }`}
    />

    <button
      onClick={applyDiscount}
      disabled={!!appliedCode}
      className={`px-4 h-11 rounded-xl text-white text-[14px]
        ${
          appliedCode
            ? "bg-[#D9176C66]"
            : "bg-[#D9176C]"
        }`}
    >
      Apply
    </button>
  </div>

  {appliedCode && (
    <button
      onClick={removeDiscount}
      className="h-10 text-[#D9176C] border border-[#D9176C] rounded-xl text-[14px]"
    >
      Remove Code
    </button>
  )}

  {msg.text && (
    <div
      className={`text-[13px] px-3 py-2 rounded-xl border
        ${
          msg.type === "success"
            ? "text-[#1C7C54] border-[#1C7C5433] bg-[#1C7C540D]"
            : "text-[#B42318] border-[#B4231833] bg-[#B423180D]"
        }`}
    >
      {msg.text}
    </div>
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
        {
            cartItems.map((item) => {

  console.log("image-url", item.coverImageUrl);
              return(
                        <div key={item.documentId} className="w-full flex gap-[25px] items-center px-[60px] p-[24px] bg-[#FFFFFF] relative">
            <div className="w-[535px] flex gap-[24px]">
                <img src={item.image || getBookImage(item)} className='h-full w-[173px]' alt={item.title} />

                <div className=' w-full flex flex-col gap-[35px]'>
                    <div className='w-[251px] flex flex-col gap-[8px]'>
                        <div className="w-full flex flex-col">
                            <h3 className='text-[18px] text-[#222222] font-bold'>{item.title}</h3>
                            <p className='text-[14px] text-[#222222]'><span className='text-[14px] text-[#22222280]'>Author:</span>{item.author}</p>
                        </div>

                        <p className='w-full text-[14px] text-[#22222280]'>
                            {item.description?.slice(0, 120) || "No description."}
                        </p>

                    </div>

                    <div className='w-full flex flex-col gap-[32px]'>
                        <button className=' w-[138px] h-[35px] flex justify-center items-center gap-[3px] bg-[#FFFFFF] text-[#22222280] text-[14px] rounded-xl border border-[#22222233]'>
                            <img src={shippingIcon}  alt="shippingIcon" />
                            Free Shipping
                        </button>

                        <p className='text-[14px] text-[#22222280]'><span className='text-[14px] text-[#22222280] font-bold'>ASIN: </span>{item.isbn13 || "-"}</p>
                    </div>
                </div>
            </div>

                        <div className='w-[400px] items-center  flex gap-[144px]'>
                <div className='w-[86px] items-center flex gap-[6.5px]'>
                    <button className='w-[20px] h-[20px] flex justify-center items-center text-[#D9176C] font-semibold bg-[#FFFFFF] rounded-full border border-[#D9176C] '
                            onClick={() => changeCartQty(item.id, item.qty - 1)}
                            >-</button>
                    <h2 className='text-[#222222] text-[24px] font-semibold'>{item.qty}</h2>
                    <button className='w-[20px] h-[20px] flex justify-center items-center text-[#D9176C] font-semibold bg-[#FFFFFF] rounded-full border border-[#D9176C] '
                            onClick={() => addToCart({ ...item, documentId: item.id })}
                            >+</button>

                </div>

                <p className='text-[30px] text-[#000000] font-semibold'>{item.price.toFixed(2)}</p>
                <p className='text-[30px] text-[#000000] font-semibold'>{(item.price * item.qty).toFixed(2)}</p>
                <button
                  className="absolute top-[46%] right-[10%] w-[24px] h-[24px] bg-transparent border-0"
                  onClick={() => removeFromCart(item.id)}
                >
                  <img src={trashIcon} className="w-[24px] h-[24px]" alt="" />
                </button>
            </div>


        </div>
              )
            })
        }



        
      </div>

      <div className='w-full px-[112px] py-[40px] mb-[120px] flex gap-[156px] bg-[#3b2f4a1a]'>
        <div className='flex flex-col gap-[80px]'>
            <div className="w-full flex flex-col gap-[16px]">
                <h4 className='text-[26px] text-[#222222] font-bold'>Payment Summary</h4>
                <p className='w-[516px] text-[16px] text-[#22222280]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo</p>
            </div>

            <div className="w-full flex flex-col gap-[24px]">
              <p className="text-[#22222280] text-[18px]">Have a discount code?</p>

<div className="w-full flex flex-col gap-[10px]">
  <div className="w-full flex gap-[12px] items-center">
    <div className="w-[284px] relative">
      <input
        type="text"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (msg.text) setMsg({ type: "", text: "" });
        }}
        disabled={!!appliedCode}
        className={`outline-0 w-full h-[52px] pl-[53px] pr-[16px] text-[16px] rounded-xl border bg-transparent
          ${appliedCode ? "text-[#22222266] border-[#22222222]" : "text-[#22222280] border-[#22222233]"}`}
        placeholder="Enter Promo Code"
      />
      <img src={ticket} className="absolute top-[16px] left-[24px]" alt="" />
    </div>

    <button
      type="button"
      onClick={applyDiscount}
      disabled={!!appliedCode}
      className={`h-[52px] px-[22px] rounded-xl text-[16px] font-semibold border-0 transition
        ${appliedCode ? "bg-[#D9176C66] text-white cursor-not-allowed" : "bg-[#D9176C] text-white hover:opacity-90 active:scale-[0.99]"}`}
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
        </div>

        <div className="w-full flex flex-col gap-[40px]">
            <div className='w-full flex flex-col gap-[24px]'>
                <div className="w-full flex flex-col gap-[24px] border-b-1 border-[#22222233] pb-[24px]">
                    <p className='w-full flex justify-between text-[24px] text-[#222222] font-semibold'><span className='text-[20px] text-[#22222280]'>Subtotal</span>${subtotal.toFixed(2)}</p>
                    <p className='w-full flex justify-between text-[24px] text-[#222222] font-semibold'><span className='text-[20px] text-[#22222280]'>Shipping</span>Free Delivery</p>
                    <p className='w-full flex justify-between text-[24px] text-[#222222] font-semibold'><span className='text-[20px] text-[#22222280]'>Tax</span>${tax}</p>
                </div>
                <p className="flex justify-between text-[28px] text-[#D9176C] font-bold">
  <span className="text-[20px] text-[#22222280] font-semibold">Total</span>
  <span>${total.toFixed(2)}</span>
</p>

{discount > 0 && (
  <p className="flex justify-between text-[22px] text-[#222222] font-semibold">
    <span className="text-[20px] text-[#22222280] font-semibold">Discount (25%)</span>
    <span className="text-[#D9176C]">- ${discount.toFixed(2)}</span>
  </p>
)}

<p className="flex justify-between text-[30px] text-[#222222] font-bold">
  <span className="text-[20px] text-[#22222280] font-semibold">Final Total</span>
  <span>${finalTotal.toFixed(2)}</span>
</p>

 
            </div>

            <div className="w-full flex flex-col gap-[12px]">
                <button className='btn w-full h-[48px] text-[16px] font-semibold bg-[#D9176C] rounded-xl border-0'
                        onClick={() => navigate('/checkout')}>Check out</button>
                <button className='btn w-full h-[48px] text-[16px] font-semibold bg-transparent rounded-xl text-[#D9176C] border border-[#D9176C] '>Keep Shopping</button>
            </div>
        </div>
      </div>
    </div>
    </div>
    </>
    

  )
}
