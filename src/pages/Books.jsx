import { useEffect, useState } from 'react';
import settings from '../assets/Books/settings-sliders (1) 1.png';
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoMicOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import button from 'daisyui/components/button';





export default function Books() {
  const [categoriesHight,setCategoriesHeight] = useState('');
  const [toggleText,setToggleText] = useState('Load More');
  const [activeIndex, setActiveIndex] = useState(0);
  const categories = [
    
    {categoryName:'All Categories',itemsNumber:'1450'},
    
    {categoryName:'Business',itemsNumber:'140'},
    
    {categoryName:'Kids',itemsNumber:'309'},
    
    {categoryName:'Art',itemsNumber:'102'},
    
    {categoryName:'History',itemsNumber:'204'},
    
    {categoryName:'Romance', itemsNumber:'89'},
    
    {categoryName:'Fantasy', itemsNumber:'47'},
    
    {categoryName:'Self Helping', itemsNumber:'163'},
    {categoryName:'Cooking', itemsNumber:'211'},
    {categoryName:'Sports', itemsNumber:'92'},
    {categoryName:'Music', itemsNumber:'104'},
    {categoryName:'Fishing',itemsNumber:'97'},
    {categoryName:'Sport',itemsNumber:'201'},
    {categoryName:'Programming',itemsNumber:'100'}];
  
    const categoriesBtns = ['Business','Self Help','History','Romance','Art','Kids','Music','Cooking'];

    const toggleLoadMore = ()=> {
      if(toggleText == 'Load More'){
           
      setToggleText('Close');
      setCategoriesHeight('full');
      }
      if(toggleText == 'Close'){
        setToggleText('Load More');
        setCategoriesHeight('[321px]');
      }
      
   
    }

    useEffect(() => {
      setCategoriesHeight('[321px]')
    },[])
  return (
    <div className="h-full w-full lg:max-w-full mx-auto  bg-[#F5F5F5] flex">
      <div className=" w-[372px] pr-[16px] border-r-1 border-[#2222221a] pl-[60px] pt-[60px] bg-[#F5F5F5] flex flex-col gap-[32px]">
        <div className="w-full flex gap-[4.5px] items-center">
          <img className='w-[24px] h-[24px]' src={settings} alt="" />
          <h4 className='text-[24px] text-[#222222] font-semibold'>Filter</h4>
        </div>

        <div className='w-full h-full flex flex-col gap-[24px] '>
                  <div className='w-full flex flex-col p-[16px]  gap-[8px] bg-[#FFFFFF]  '>
          <div className={`w-full gap-[16px] h-${categoriesHight} flex flex-col  overflow-y-hidden`}>
            <div className='w-full items-center flex justify-between'>
              <h4>Categories</h4>
              <IoIosArrowDown />
            </div>

            <div className='w-full flex flex-col gap-[10px]'>
              {
                categories.map((el,index) => {
                  return (
                      <div className="w-full flex items-center gap-[108px]">
                <div className='w-[115px] flex gap-[1.5px] items-center'>
                  <input type="checkbox" 
                         className='checkbox rounded rounde-0 p-0 w-[16px] h-[16px] bg-[#22222280]'/>
                  <h4 className='text-[14px] text-[#222222] font-400'>{el.categoryName}</h4>
                </div>

                <h4 className='text-[14px] flex w-[41px] justify-end text-[#22222280] font-400'>({el.itemsNumber})</h4>
              </div>
                  )
                                

                })
              }

            </div>
            
          </div>
          
          <h4 className="w-full hover:cursor-pointer flex justify-center text-[#D9176C] text-[14px] font-semibold"
              onClick={() =>toggleLoadMore()}>{toggleText}</h4>

         
        
        </div>
        <div className='w-full flex flex-col gap-[24px]'>
          <div className='w-full p-[16px] flex justify-between items-center bg-[#FFFFFF]'>
            <h4 className='text-[18px] font-semibold text-[#222222]'>Publisher</h4>
            <MdKeyboardArrowRight className='w-[24px] h-[24px] text-[#222222]' />

          </div>

          <div className='w-full p-[16px] flex justify-between items-center bg-[#FFFFFF]'>
            <h4 className='text-[18px] font-semibold text-[#222222]'>Year</h4>
            <MdKeyboardArrowRight className='w-[24px] h-[24px] text-[#222222]' />

          </div>

        </div>
        </div>


        
      </div>

      <div className="w-full flex flex-col gap-[40px] h-full pl-[24px] pr-[60px] pb-[97px] pt-[60px] bg-[#F5F5F5]">
        <div className="w-full flex flex-col gap-[24px] pr-[60px] h-[150px] ">
          <div className="w-full flex justify-between items-center">
            <div className="w-full h-[59px] flex">
              <div className='relative'>
                <input type="text" className='outline-0 w-[688px] h-full pl-[24px] text-black text-[18px]  bg-[#FFFFFF]  rounded-l-4xl rounded-r-0 border-[#22222233] placeholder:text-[20px] placeholder:text-[#22222280] '
                       placeholder='search' />
                <IoMicOutline className='absolute right-[17.5px] top-[17.5px] text-2xl text-[#22222280]' />

                
              </div>
              <button className='bnt bg-[#FFFFFF] rounded-r-4xl w-[70px] border  border-l-[#22222280] h-full flex justify-center items-center '>
                <IoSearchOutline className='text-2xl text-[#D9176C]' />

              </button>
            </div>

            <div className='w-full h-[45px] relative'>
              <button className=' w-full rounded-xl  h-full text-[#22222280] bg-[#0000001a] flex items-center pl-[16px]'>
                Sort by
              </button>
              <MdKeyboardArrowRight className='absolute w-[24px] h-[24px] top-[10.5px] right-[10.5px] text-xl text-[#22222280]'/>

            </div>
          </div>

<div className="w-full flex gap-[12px]">
  {categoriesBtns.map((el, index) => {
    return (
      <button
        key={index}
        onClick={() => setActiveIndex(index)}
        className={`
          w-[114px] h-[42px] rounded-xl
          flex justify-center items-center
          text-[16px] transition-all duration-200
          ${
            activeIndex === index
              ? "bg-[#d9176c80] text-white"
              : "bg-[#00000033] text-[#222222]"
          }
        `}
      >
        {el}
      </button>
    );
  })}
</div>

        </div>
        <div className="w-full h-[1117px] bg-yellow-200"></div>
      </div>
    </div>
  )
}
