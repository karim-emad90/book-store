import truck from '../assets/ShopAdvantages/truck.svg'
import creditCard from '../assets/ShopAdvantages/credit-card-buyer 1.svg'
import headset from '../assets/ShopAdvantages/user-headset 1.svg'
import restock from '../assets/ShopAdvantages/restock 1.svg'
import designBook from '../assets/SliderBooks/designbook.png'
import richDadBook from '../assets/LoginPage/richdadbook.png'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import RatingStars from '../store/RatingStars'
import { IoCartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import leftArrow from '../assets/LoginPage/arrows/Arrow - Left.png';
import rightArrow from '../assets/LoginPage/arrows/Arrow - right.png';
import { Link } from 'react-router-dom'




const books = Array(10).fill(designBook);
export default function BeforeLogin() {
  const ShopAdvantages = [
    {imgSrc:truck, header:'Fast & Reliable Shipping', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    {imgSrc:creditCard, header:'Secure Payment', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    {imgSrc:restock, header:'Easy Returns', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    {imgSrc:headset, header:'24/7 Customer Support', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.'},
    

  ]

  
const trackRef = useRef(null);
const cardRef = useRef(null);

const [index, setIndex] = useState(0);
const [step, setStep] = useState(0);

const visibleCount = window.innerWidth >= 1024 ? 3 : 1; // 3 كروت ظاهرين على اللارج
const isAtEnd = index >= books.length - visibleCount;



const isAtStart = index === 0;

const totalBooks = books.length;


const [data,setData] = useState([]);

useEffect(() => {
  const calculateStep = () => {
    if (!cardRef.current) return;
    const cardWidth = cardRef.current.offsetWidth;
    const gap = window.innerWidth >= 1024 ? 32 : 16;
    setStep(cardWidth + gap);
  };

  calculateStep();
  window.addEventListener("resize", calculateStep);

  return () => window.removeEventListener("resize", calculateStep);
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex(prev => {
      if (prev >= books.length - 1) return prev; // وقف عند آخر كارت
      return prev + 1;
    });
  }, 5000);

  return () => clearInterval(interval);
}, []);

const maxIndex = books.length - visibleCount;

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



 useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://bookstore.eraasoft.pro/api/home"
        );
        console.log(res.data.data.recommended);
        setData(res.data.data.recommended);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="h-full w-full lg:max-w-full mx-auto gap-[40px] lg:gap-0  bg-[#F5F5F5] flex flex-col    ">
      <div className="hidden w-full h-dvh mb-[24px] lg:flex justify-center gap-[61px] items-center ">
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

      <div className='w-full h-full flex flex-col justify-center items-center gap-[24px] lg:gap-[80px] bg-[#F5F5F5] lg:bg-[#3B2F4A] '>
        <div className='w-full lg:w-[516px] h-[87px] text-[#FFFFFF] flex items-center flex-col gap-[8px]'>
          <h3 className='self-start text-black text-[26px] font-bold '>
            Best Seller
          </h3>
          <p className='hidden lg:block w-full text-center text-[#ffffff80] text-[16px] font-normal'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.
          </p>
        </div>

<div className="w-full">

  {/* Slider */}
  <div className="w-full h-[260px] overflow-hidden">
<div
  ref={trackRef}
  className="flex flex-nowrap h-full transition-transform duration-500 ease-in-out"
  style={{
    transform: step ? `translateX(-${index * step}px)` : "translateX(0)",
    gap: window.innerWidth >= 1024 ? "32px" : "16px",
  }}
>
      {books.map((book, i) => (
        <div
          key={i}
          ref={i === 0 ? cardRef : null}
          className="w-[119.77px] lg:w-[173px] h-full shrink-0 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${book})` }}
        />
      ))}
    </div>
  </div>

  {/* Mobile controls */}
<div className="flex justify-center gap-4 mt-4 lg:hidden">

  {/* Left */}
  <button
    type="button"
    disabled={isAtStart}
    onClick={() => setIndex(p => Math.max(p - 1, 0))}
    className={`w-10 h-10 text-black text-3xl rounded-full flex items-center justify-center
      ${isAtStart
        ? "bg-transparent opacity-40 cursor-default text-black"
        : "bg-white shadow cursor-pointer active:scale-95"}
    `}
  >
    <MdKeyboardArrowLeft />

  </button>

  {/* Right */}
  <button
    type="button"
    disabled={isAtEnd}
    onClick={() => setIndex(p => Math.min(p + 1, maxIndex))}
    className={`w-10 h-10 text-black text-3xl rounded-full flex items-center justify-center
      ${isAtEnd
        ? "bg-transparent opacity-40 cursor-default"
        : "bg-white shadow cursor-pointer active:scale-95"}
    `}
  >
    <MdKeyboardArrowRight />

  </button>

</div>

</div>


  <button className='btn hidden lg:block  rounded border-0 bg-[#D9176C] text-[18px] font- w-[180px] h-[48px] text-[#FFFFFF]'>Shop Now</button>
  


      </div>

      <div className='w-full  lg:px-[60px] lg:py-[120px] h-full justify-center items-center flex flex-col gap-[40px]'>
        <div className='order-1  flex gap-[116px]  w-full'>
          <h2 className='text-[15px] w-[161px] lg:w-fit lg:text-[26px] text-[#222222] font-bold'>
          Recomended For You
        </h2>

        <Link className="text-[16px] lg:hidden flex items-center  w-[70px]  lg:w-fit text-[#D9176C] font-semibold">See all<MdKeyboardArrowRight className='w-[18px] text-xl'/></Link>

        </div>
        

        <div className='order-2 overflow-scroll  px-[16px]  w-full  h-[124px] lg:h-[344px] flex flex-col lg:flex-row gap-[16px] lg:gap-[24px]'>
          {
            data.map((book,index)=> {
              return(
                            <div  key={index} className='lg:w-full w-full h-full p-[16px] lg:p-[40px] flex lg:gap-[39px] gap-[16px] justify-center items-center'>
              <div className='lg:w-[176px] w-[93px] h-full bg-cover bg-no-repeat bg-center '
                   style={{ backgroundImage: `url(${richDadBook})` }}
              >
              </div>

              <div className='lg:w-[353px] w-[202px] h-full flex flex-col gap-[16px] lg:gap-[24px]'>
                <div className='w-full h-[19px] lg:h-[132px] flex flex-col lg:gap-[8px]'>
                  <div className='w-full flex flex-col lg:gap-[4px]'>
                    <h3 className='lg:text-[18px] lg:text-[14px] text-[10px] text-[#222222] font-bold'>{book.bookName}</h3>
                    <h4 className='lg:text-[14px] text-[10px] font-semibold text-[#222222]'><span className='lg:text-[14px] text-[10px] font-normal text-[#22222280]'>Author: </span>{book.author}</h4>

                  </div>

                  <p className='hidden lg:block w-full text-[14px] text-[#222222] font-normal'>
                         {book.description}
                         </p>
                </div>

                <div className='w-full flex  flex-wrap lg:flex-nowrap lg:flex-col lg:gap-[16px]'>
                  <div className='w-full flex flex-col lg:flex-row justify-between'>
                    <div className='w-full h-[35px]  lg:h-[43px] flex flex-col gap-[8px]'>
                      <div className='w-full flex gap-[8px]'>
                        <div className='lg:w-[96px] w-[74px]'>
                          <RatingStars/>
                        </div>
                           <p className='lg:text-[12px] text-[10px] font-semibold text-[#222222]'>(180 Review)</p>
                        
                        
                      </div>

                     
                        <p className='hidden lg:block text-[14px] text-[#222222] font-semibold'><span className='text[14px] text-[#222222] font-light'>Rate:</span>4.2</p>
                        
                    </div>
                     
                     <div className='w-full flex relative'>
                         <p className='lg:text-[26px] text-[18px] font-semibold text-[#222222]'>${book.price}</p>
                             <div className=' lg:hidden absolute -top-2 left-27 w-full self-end  flex gap-[10px]'>
                    <button className='w-[32px] h-[32px] flex items-center justify-center lg:w-[289px] lg:h-[48px] bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold'>
                     
                      <IoCartOutline className=' text-lg' />

                    </button>

                    <button className=' w-[32px] h-[32px] flex items-center justify-center lg:w-[48px] lg:h-[48px] bg-[#FFFFFF] rounded-lg border border-[#D9176C] text-[#D9176C]'>
                      <FaRegHeart className='text-lg' />

                    </button>
                  </div>
                     </div>
                    
           
                    
                  </div>
                <div className='hidden lg:flex w-full self-end  gap-[16px]'>
                    <button className='btn w-[32px] h-[32px] lg:w-[289px] lg:h-[48px] bg-[#D9176C] rounded-lg text-[16px] text-[#FFFFFF] font-semibold'>
                      Add To Cart
                      <IoCartOutline />

                    </button>

                    <button className='btn w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] bg-[#FFFFFF] border border-[#D9176C] text-[#D9176C]'>
                      <FaRegHeart />

                    </button>
                  </div>


                </div>

              </div>
            </div>

              )
            })
          }

        </div>
        
      </div>

      <div className="hidden relative w-full lg:flex flex-col  py-[120px] pl-[60px] pr-[120px] gap-[51px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2
                  h-[2px] w-[1440px] bg-gray-300 rounded-full">
          </div>
        <div className='w-full flex items-center justify-center gap-[599px]'>
          <div className='w-[516px] flex flex-col h-[95px] gap-[16px]'>
            <h2 className='text-[26px] font-bold text-[#222222]'>Flash Sale</h2>
            <p className='w-full text-[16px] font-light text-[#22222280]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.</p>
          </div>

<div className="relative w-[145px] h-[145px] flex items-center justify-center">
  {/* Outer circle with different weight & opacity */}
  <div
    className="absolute inset-0 rounded-full"
    style={{
      background: `
        conic-gradient(
          from 180deg,
          rgba(236,72,153,0.35) 0deg,
          rgba(236,72,153,0.35) 160deg,
          rgba(236,72,153,1) 160deg,
          rgba(236,72,153,1) 360deg
        )
      `,
      padding: "3px",
    }}
  >
    {/* Inner white circle */}
    <div className="w-full h-full bg-white rounded-full" />
  </div>

  {/* Time text */}
  <span className="relative z-10 text-[18px] font-bold text-[#111]">
    30:00:00
  </span>

  {/* Bottom dot */}
  <div className="absolute bottom-[-4px] w-[12px] h-[12px] bg-[#ec4899] rounded-full shadow-sm" />
</div>





        </div>

        <div className='w-[1016px] self-center justify-items-center flex'>
          <div className='w-full flex gap-[16px] items-center'>
            <button className='btn w-[44px] bg-[#F5F5F5] text-center border-0 rounded-full shadow-[0_6px_0_0_rgba(0,0,0,0.25)] '>
              <img src={leftArrow} alt="leftArrow" />

            </button>
         <div className='w-[888px] h-full flex lg:gap-[40px]'>
          {data.map((book, index) => {
            return (
               <div className='w-[424px] h-full lg:h-[294px] flex gap-[24px] p-[16px] bg-[#3B2F4A] rounded-lg'>
              <div className='w-[176px] h-full'
                   style={{ backgroundImage: `url(${richDadBook})` }}
                   
              ></div>

              <div className='w-[192px] flex flex-col gap-[17px]'>
                <div className='w-full h-[94px] flex flex-col gap-[16px]'>
                  <div className='w-full flex flex-col gap-[4px]'>
                    <h3 className='text-[16px] max-w-[182px] truncate  text-[#FFFFFF] font-bold'>{book.bookName}</h3>
                    <div className='w-full flex'>
                      <p className='text-[12px] text-[#FFFFFF] font-semibold'><span className='text-[12px] text-[#ffffff80] font-light'>Author:</span>{book.author}</p>
                    </div>
                  </div>

                  <div className='w-full flex flex-col gap-[4px]'>
                      <div className='w-full items-center flex gap-[8px]'>
                        <div className='w-[96px]'>
                          <RatingStars/>
                        </div>
                        <p className='text-[12px] font-semibold text-[#ffffff80]'>({book.countReview} Review)</p>
                      </div>

                        <div className='flex gap-[2px]'>
                        <p className='text-[14px] text-[#FFFFFF] font-semibold'><span className='text[14px] text-[#ffffff80] font-light'>Rate:</span>4.2</p>
                      </div>
                    
                  </div>
                </div>

                <div className='w-full flex flex-col gap-[24px]'>
                  <div className='w-full flex-col gap-[16px]'>
                    <div className='w-full h-full lg:h-[46px] flex items-center  gap-[5.5px]'>
                      <p className='lg:text-[14px] text-[18px] font-semibold text-[#ffffff4d]'>${book.price}</p>
                      <p className='hidden lg:block text-[22px] justify-self-start font-semibold text-[#FFFFFF]'>${book.final_price}</p>
                    </div>

                    <div className="w-full flex h-[33px] flex-col gap-[8px] max-w-[650px]">
  {/* Progress bar background */}
  <div className="hidden lg:block w-full h-[9px] bg-[#4a4158] rounded-full overflow-hidden">
    {/* Progress fill */}
    <div className="h-full w-[75%] bg-[#f2b35e] rounded-full"></div>
  </div>

  {/* Text */}
  <p className=" text-[12px] text-[#ffffff80] font-light">
    {book.stock} books left
  </p>
</div>

                  </div>

                  <button className='btn w-[52px] border-0 h-[48px] self-end  bg-[#D9176C]'>
                    <IoCartOutline />
                  </button>
                </div>
              </div>
               </div>

            )
          })}



           <button className='btn w-[44px] self-center bg-[#F5F5F5] text-center border-0 rounded-full shadow-[0_6px_0_0_rgba(0,0,0,0.25)] '>
              <img src={rightArrow} alt="rightArrow" />

            </button>

         </div>


          </div>

        
        </div>
      </div>







    </div>
    

  )
}
