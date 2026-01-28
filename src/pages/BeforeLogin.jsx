import truck from '../assets/ShopAdvantages/truck.svg'
import creditCard from '../assets/ShopAdvantages/credit-card-buyer 1.svg'
import headset from '../assets/ShopAdvantages/user-headset 1.svg'
import restock from '../assets/ShopAdvantages/restock 1.svg'
import designBook from '../assets/SliderBooks/designbook.png'
import { useEffect, useRef, useState } from 'react'

const books = Array(10).fill(designBook);
export default function BeforeLogin() {
  const ShopAdvantages = [
    {imgSrc:truck, header:'Fast & Reliable Shipping', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    {imgSrc:creditCard, header:'Secure Payment', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    {imgSrc:restock, header:'Easy Returns', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    {imgSrc:headset, header:'24/7 Customer Support', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    

  ]

  
  const CARD_WIDTH = 173;
const GAP = 32;
const STEP = CARD_WIDTH + GAP;

const totalBooks = books.length;

const [index, setIndex] = useState(0);
const trackRef = useRef(null);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => prev + 1);
  }, 5000); // ⏱️ كل 5 ثواني

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (index === totalBooks) {
    const track = trackRef.current;

    // شيل الأنيميشن
    track.style.transition = "none";
    setIndex(0);

    // force reflow
    track.offsetHeight;

    // رجّع الأنيميشن
    track.style.transition = "transform 0.5s ease-in-out";
  }
}, [index, totalBooks]);


  return (
    <div className="h-full w-full lg:max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[120px]   ">
      <div className="w-full flex justify-center gap-[61px] items-center">
        {
          ShopAdvantages.map((el,index) => {
        return (<div key={index} className="w-[275px] flex flex-col gap-4">
          <img src={el.imgSrc} className='w-[30px]' alt="" />
          <h3 className='text-[#222222] text-[18px] font-bold'>{el.header}</h3>
          <p className='w-full text-[16px] font-normal text-[#8c8c8c] '>{el.details}</p>

        </div>)

          })
        }


                
      </div>

      <div className='w-full h-dvh flex flex-col justify-center items-center gap-[80px] bg-[#3B2F4A] '>
        <div className='w-[516px] h-[87px] text-[#FFFFFF] flex items-center flex-col gap-[8px]'>
          <h3 className='text-[26px] font-bold '>
            Best Seller
          </h3>
          <p className='w-full text-center text-[#ffffff80] text-[16px] font-normal'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.
          </p>
        </div>

        <div className="w-full h-[260px] bg-[#3B2F4A] overflow-hidden">
  <div
    ref={trackRef}
    className="flex gap-[32px] h-full transition-transform duration-500 ease-in-out"
    style={{
      transform: `translateX(-${index * STEP}px)`,
    }}
  >
    {[...books, ...books].map((book, i) => (
      <div
        key={i}
        className="w-[173px] h-full rounded-2xl bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url(${book})` }}
      />
    ))}
  </div>
  
</div>
<div>
  <button className='btn  rounded border-0 bg-[#D9176C] text-[18px] font- w-[180px] h-[48px] text-[#FFFFFF]'>Shop Now</button>
  
</div>

      </div>





    </div>
    

  )
}
