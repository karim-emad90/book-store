
import richDadBook from '../assets/LoginPage/richdadbook.png'
import fb from '../assets/ProductDetails/fb.png'
import insta from '../assets/ProductDetails/insta.png'
import twiteer from '../assets/ProductDetails/x.png'
import whats from '../assets/ProductDetails/whats.png'
import RatingStars from '../store/RatingStars'
import badgeCheck from '../assets/ProductDetails/badge-check (1) 1.png'
import shippingVan from '../assets/ProductDetails/shipping-fast 1 (1).png'
import cart from '../assets/ProductDetails/Vector (2).png'
import heart from '../assets/ProductDetails/heart (1) 1.png'

export default function ProductDetails() {
  return (
    <div className="w-full h-full flex flex-col gap-[70px] p-[60px]">
      <div className="w-full  flex gap-[24px]">
        <img src={richDadBook} className='w-[312px] h-[456px]' alt="" />

        <div className='w-full flex flex-col gap-[40px]'>
         <div className="w-full h-[237px] flex flex-col gap-[24px]">
            <div className="w-full flex gap-[38px]">
                <div className="w-[758px] flex flex-col gap-[8px]">
                    <h3 className='text-[28px] text-[#222222] font-bold'>Rich Dad And Poor Dad</h3>
                    <p className='w-full text-[18px] font-[400] text-[#22222280]'>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo. Aliquam in justo varius, sagittis neque ut, malesuada leo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo. Aliquam in justo varius, sagittis neque ut, malesuada leo.
                    </p>
                </div>

                <div className="w-[188px] flex gap-[12px] self-start">
                 <img src={fb} alt="" />
                 <img src={insta} alt="" />
                 <img src={twiteer} alt="" />
                 <img src={whats} alt="" />
                </div>
            </div>

            <div className="w-full flex gap-[24px]">
              <div className='w-[121px] flex flex-col gap-[4px]'>
                <h4 className='text-[16px] text-[#22222280] '>Author</h4>
                <p className='text-[14px] font-semibold text-[#222222]'>Robert T. Kiyosaki</p>
              </div>
              <div className='w-[115px] flex flex-col gap-[4px]'>
                <h4 className='text-[16px] text-[#22222280] '>Publication Year</h4>
                <p className='text-[14px] font-semibold text-[#222222]'>1997</p>
              </div>
              <div className='w-[40px] flex flex-col gap-[4px]'>
                <h4 className='text-[16px] text-[#22222280] '>Book</h4>
                <p className='text-[14px] font-semibold text-[#222222]'>1 Of 1</p>
              </div>
              <div className='w-[39px] flex  flex-col gap-[4px]'>
                <h4 className='text-[16px] text-[#22222280] '>Pages</h4>
                <p className='text-[14px] font-semibold text-[#222222]'>336</p>
              </div>
              <div className='w-[54px] flex flex-col gap-[4px]'>
                <h4 className='text-[16px] text-[#22222280] '>Language</h4>
                <p className='text-[14px] font-semibold text-[#222222]'>English</p>
              </div>
            </div>
         </div>

<div className=" w-full flex flex-col gap-[48px]">
           <div className='w-full flex justify-between'>
          <div className="w-[241px] flex flex-col gap-[16px] self-start">
            <div className="w-full flex gap-[8px]">
              <RatingStars/>
              <p className='text-[16px] text-[#00000080]'>(210 Review)</p>
              </div>

              <p className='flex gap-[2px] text-[18px] text-[#00000080]'>Rate: <span className='text-[18px] font-semibold text-[#222222]'>4.2</span></p>
            </div>

            <div className='w-[293px] flex flex-col gap-[12px]'>
              <div className='w-full flex gap-[12px]'>
                <button className='w-[100px] h-[35px] flex justify-center items-center gap-[5px] rounded-xl border-1 border-[#22222233] bg-[#FFFFFF] text-14px text-[#25D994]'>
                  <img src={badgeCheck} alt="" />
                  In Stock</button>
                
                <button className='w-[181px] h-[35px] flex justify-center items-center gap-[5px] rounded-xl border-1 border-[#22222233] bg-[#FFFFFF] text-14px text-[#22222280]'>
                  <img src={shippingVan} alt="" />
                  Free Shipping Today</button>

              </div>
              
                             <button className='w-[181px] h-[35px] flex justify-center items-center gap-[5px] rounded-xl border-1 border-[#22222233] bg-[#FFFFFF] text-14px text-[#EAA451]'>
                              Discount code: Ne212
                  </button>
            </div>
          </div>

          <div className='w-full flex items-start justify-between'>
            <div className='w-[205px] flex gap-[16px] items-center'>
              <p className='text-[36px] text-[#222222] font-semibold'>$40.00</p>
              <p className='text-[24px] text-[#22222280] font-semibold line-through'>$40.00</p>
            </div>

            <div className='w-[398px] h-[48px] flex gap-[40px]'>
              <div className="w-full justify-center items-center flex gap-[8.5px]">
                <button className='w-[24px] h-[24px] text-xl rounded-full border-2 border-[#D9176C] text-[#D9176C] font-bold flex justify-center items-center'>-</button>
                <p className='text-[30px] font-semibold text-[#222222]'>1</p>
                <button className='w-[24px] h-[24px] text-xl rounded-full border-2 border-[#D9176C] text-[#D9176C] font-bold flex justify-center items-center'>+</button>
              </div>

              <div className='w-[244px] flex gap-[16px]'>
                <button className='w-[180px] h-full bg-[#D9176C] text-[#FFFFFF] rounded-xl flex justify-center items-center gap-[10px]'>
                 
                 Add To Cart
                 <img src={cart} alt="" />
                </button>
                <button className='w-[48px] h-full bg-[#FFFFFF] text-[#D9176C] border-1 border-[#D9176C] rounded-xl flex justify-center items-center'>
                  <img src={heart} alt="" />
                </button>
              </div>
            </div>
          </div>

</div>

         </div>
        </div>
      </div>
    
  )
}
