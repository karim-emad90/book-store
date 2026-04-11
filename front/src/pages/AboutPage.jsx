import rightArrow from '../assets/AboutPage/ep_right.png'
export default function AboutPage() {
 const ourMission = [{title:'Quality Selection', description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.Quality SelectionLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,"},
  {title:'Exceptional Service', description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.Quality SelectionLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,"},
  {title:'Set Up Stores', description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.Quality SelectionLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,"}
 ]
  return (
    <div className="h-full w-full py-[120px] lg:max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[80px] justify-center items-center">
      <h3 className="text-[34px] text-[#222222] font-bold">Our Mission</h3>
      <div className="w-full flex justify-center gap-[24px]">
        {
          ourMission.map((item,index) => (
                      <div key={index} className="w-[360px] bg-[#FFFFFF] p-[24px] rounded-xl border border-[#22222233] flex flex-col gap-[24px]">
          <h3 className="text-[22px] text-[#222222] font-bold">{item.title}</h3>
          <p className="w-[312px] text-[16px] text-[#22222280]">{item.description}</p>
          <div className="relative w-[103px] flex hover: cursor-pointer  ">
            
                <button className="  bg-transparent flex  items-center border-0 w-full h-[22px] text-[16px] text-[#D9176C] hover: cursor-pointer ">{index === ourMission.length -1 ? 'Soon':'View More'}</button>
            <img src={rightArrow} alt="" className={`${index === ourMission.length -1? 'hidden' : 'absolute right-1 top-1 ' }`} />
              
           
            
          </div>
        </div>
          ))
        }

      </div>
    </div>
  )
}
