import { Field, Form, Formik } from "formik";
import { useState } from "react";
import pencil from "../assets/CheckoutPage/fi-rr-pencil.png"
import richdad from "../assets/LoginPage/richdadbook.png"
import van from "../assets/ProductDetails/shipping-fast 1 (1).png"
import ticket from "../assets/CheckoutPage/ticket (2) 1 (1).png"
import design from "../assets/SliderBooks/designbook.png"
import MobileFooter from "../components/MobileFooter";

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

  return (
    <div className="w-full h-full py-[30px] px-[16px] sm:py-[60px] sm:px-[50px] flex flex-col lg:flex-row gap-[24px] bg-[#F5F5F5]">

      {/* Shipping */}
      <Formik>
        <Form className="w-full lg:w-[760px] p-[20px] sm:p-[40px] rounded-xl bg-[#FFFFFF] flex flex-col gap-[24px]">

          <div className="w-full flex flex-col gap-[40px]">
            <h3 className="text-[18px] text-[#222222] font-semibold">Shipping information</h3>

            <div className="w-full flex flex-col gap-[24px]">

              <div className="w-full flex flex-col sm:flex-row gap-[16px]">

                {/* left */}
                <div className="w-full sm:w-[332px] flex flex-col gap-[24px]">

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Name</h4>
                    <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="John Smith" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Email</h4>
                    <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Johnsmith@gmail.com" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">State</h4>
                    <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Cairo" />
                  </div>

                </div>

                {/* right */}
                <div className="w-full sm:w-[332px] flex flex-col gap-[24px]">

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Phone</h4>
                    <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="123456789" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">City</h4>
                    <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Maadi" />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[14px] text-[#22222280]">Zip</h4>
                    <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="11311" />
                  </div>

                </div>

              </div>

              <div className="flex flex-col gap-[10px]">
                <h4 className="text-[14px] text-[#22222280]">Address</h4>
                <Field className="input w-full border border-[#22222233] bg-transparent text-[#222222] placeholder: text-[#222222]" placeholder="Maadi, Cairo, Egypt." />
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
                className="w-full h-[150px] sm:h-[180px] pl-[45px] pr-[38px] pt-4 border border-[#22222233] resize-none text-[#222222]
                           placeholder:text-[#22222280]"
                placeholder="Add note"
              />
            </div>

          </div>

        </Form>
      </Formik>

      {/* Order Summary */}
      <Formik>
        <Form className="w-full lg:w-[536px] p-[20px] sm:p-[40px] rounded-xl bg-white flex flex-col gap-[40px] lg:gap-[222px]">

          <div className="flex flex-col gap-[40px]">
            <h3 className="text-[18px] font-semibold text-[#222222]">Order summary</h3>

            <div className="flex flex-col gap-[24px] sm:gap-[40px]">

              {orders.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">

                  <img src={item.bookImg} className="w-[90px] h-[130px] sm:w-[111px] sm:h-[160px] object-cover mx-auto sm:mx-0" />

                  <div className="flex flex-col gap-[12px] sm:gap-[15px] w-full">

                    <div className="flex flex-col gap-[12px] sm:gap-[16px] text-center sm:text-left">
                      <h4 className="text-[14px] sm:text-[16px] font-bold text-[#222222]">{item.bookTitle}</h4>
                      <p className="text-[12px] sm:text-[14px] text-[#222222]">
                        <span className="text-[#22222280]">Author: </span>
                        {item.bookAuthor}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-[10px]">
                      <h3 className="text-[18px] sm:text-[24px] font-bold text-[#222222]">${item.totalPrice}</h3>

                      <div className="flex gap-[6px] items-center">
                        <button className="w-[18px] h-[18px] flex items-center justify-center border border-[#D9176C] rounded-full text-[#D9176C]">-</button>
                        <p className="text-[24px] font-semibold sm:text-[24px] text-[#222222]">{item.qty}</p>
                        <button className="w-[18px] h-[18px] flex items-center justify-center border border-[#D9176C] rounded-full text-[#D9176C]">+</button>
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
                  <Field className="w-full h-[52px] pl-[40px] border border-[#22222233] placeholder:text-[#22222280]" placeholder="Enter Promo Code" />
                </div>

                <button className="w-full sm:w-[88px] h-[52px] font-semibold bg-[#3b2f4a] text-white rounded-xl">
                  Apply
                </button>

              </div>
            </div>

            {/* totals */}
            <div className="flex flex-col gap-[20px]">
              <p className="flex justify-between text-[#222222] font-semibold"><span className="text-[#22222280] text-[16px] font-semibold">Subtotal</span>$80</p>
              <p className="flex justify-between text-[#222222] font-semibold"><span className="text-[#22222280] text-[16px] font-semibold">Tax</span>$4</p>
              <p className="flex justify-between text-[#22222280] font-semibold"><span className="text-[#22222280] text-[16px] font-semibold">Shipping</span>$0</p>

              <div className="flex justify-between border-t border-[#22222233] pt-3">
                <p className="text-[20px] text-[#22222280] font-semibold">Total (USD)</p>
                <p className="text-[#D9176C] text-[26px] font-semibold">$84</p>
              </div>
            </div>

            <button className="w-full h-[48px] bg-[#D9176C] text-[16px] font-semibold text-white rounded-xl">
              Confirm order
            </button>

          </div>

        </Form>
      </Formik>
       <MobileFooter/>
    </div>
  )
}