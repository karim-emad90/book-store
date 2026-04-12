import { Field, Form, Formik } from 'formik'
import rightArrow from '../assets/AboutPage/ep_right.png'
import user from '../assets/AboutPage/fi-rr-user.png'
import envelope from '../assets/AboutPage/fi-rr-envelope.png'
import pencil from '../assets/AboutPage/fi-rr-pencil (1).png'
import phone from '../assets/AboutPage/phone.png'
import email from '../assets/AboutPage/email.png'
import location from '../assets/AboutPage/location.png'
import truck from '../assets/ShopAdvantages/truck.svg'
import creditCard from '../assets/ShopAdvantages/credit-card-buyer 1.svg'
import headset from '../assets/ShopAdvantages/user-headset 1.svg'
import restock from '../assets/ShopAdvantages/restock 1.svg'
import MobileFooter from '../components/MobileFooter'

export default function AboutPage() {
  const ourMission = [
    {
      title: 'Quality Selection',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.Quality SelectionLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,',
    },
    {
      title: 'Exceptional Service',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.Quality SelectionLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,',
    },
    {
      title: 'Set Up Stores',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.Quality SelectionLorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,',
    },
  ]

  const ShopAdvantages = [
    {
      imgSrc: truck,
      header: 'Fast & Reliable Shipping',
      details:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.',
    },
    {
      imgSrc: creditCard,
      header: 'Secure Payment',
      details:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.',
    },
    {
      imgSrc: restock,
      header: 'Easy Returns',
      details:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.',
    },
    {
      imgSrc: headset,
      header: '24/7 Customer Support',
      details:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.',
    },
  ]

  return (
    <>
      <div className="block lg:hidden"></div>

      <div className="h-full w-full pt-[60px] lg:pt-[120px] px-4 sm:px-6 lg:px-0 mx-auto bg-[#F5F5F5] flex flex-col gap-[70px] lg:gap-[120px] justify-center items-center">
        <h3 className="text-[28px] lg:text-[34px] text-[#222222] font-bold text-center">
          Our Mission
        </h3>

        <div className="w-full max-w-[1200px] flex flex-col lg:flex-row justify-center gap-4 lg:gap-[24px]">
          {ourMission.map((item, index) => (
            <div
              key={index}
              className="w-full lg:w-[360px] bg-[#FFFFFF] p-5 lg:p-[24px] rounded-2xl border border-[#2222221A] shadow-sm flex flex-col gap-4 lg:gap-[24px]"
            >
              <h3 className="text-[20px] lg:text-[22px] text-[#222222] font-bold">
                {item.title}
              </h3>

              <p className="w-full text-[15px] lg:text-[16px] leading-7 text-[#22222280]">
                {item.description}
              </p>

              <div className="relative w-[103px] flex hover:cursor-pointer">
                <button className="bg-transparent flex items-center border-0 w-full h-[22px] text-[15px] lg:text-[16px] text-[#D9176C] hover:cursor-pointer">
                  {index === ourMission.length - 1 ? 'Soon' : 'View More'}
                </button>
                <img
                  src={rightArrow}
                  alt=""
                  className={`${index === ourMission.length - 1 ? 'hidden' : 'absolute right-1 top-1'}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="py-[50px] lg:py-[120px] px-4 sm:px-6 lg:px-0 w-full bg-[#3B2F4A] flex flex-col lg:flex-row gap-10 lg:gap-[192px] justify-center items-start lg:items-center rounded-none">
          <div className="w-full lg:w-[592px] flex flex-col gap-8 lg:gap-[60px]">
            <div className="w-full flex flex-col gap-[16px]">
              <p className="w-full text-[28px] sm:text-[32px] lg:text-[40px] leading-tight text-[#FFFFFF] font-bold">
                Have a Questions? <br />Get in Touch
              </p>
              <p className="w-full text-[16px] lg:text-[18px] leading-7 text-[#ffffff80]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et ultricies est. Aliquam in justo varius, sagittis neque ut, malesuada leo.
              </p>
            </div>

            <Formik>
              <Form className="w-full flex flex-col gap-5 lg:gap-[40px]">
                <div className="w-full flex flex-col sm:flex-row gap-4 lg:gap-[24px]">
                  <div className="relative w-full">
                    <Field
                      className="pl-10 w-full outline-0 h-[52px] lg:h-[56px] rounded-xl border border-[#ffffff33] bg-transparent placeholder:text-[15px] lg:placeholder:text-[16px] text-[#ffffff] text-[15px] lg:text-[16px]"
                      placeholder="Name"
                    />
                    <img src={user} className="absolute top-1/2 -translate-y-1/2 left-4" />
                  </div>

                  <div className="relative w-full">
                    <Field
                      className="pl-10 w-full outline-0 h-[52px] lg:h-[56px] rounded-xl border border-[#ffffff33] bg-transparent placeholder:text-[15px] lg:placeholder:text-[16px] text-[#ffffff] text-[15px] lg:text-[16px]"
                      placeholder="Email Address"
                    />
                    <img src={envelope} className="absolute top-1/2 -translate-y-1/2 left-4" />
                  </div>
                </div>

                <div className="relative w-full">
                  <Field
                    as="textarea"
                    rows={5}
                    className="pl-10 py-4 pr-4 w-full outline-0 min-h-[140px] lg:h-[152px] rounded-xl border border-[#ffffff33] bg-transparent placeholder:text-[15px] lg:placeholder:text-[16px] text-[#ffffff] text-[15px] lg:text-[16px] resize-none overflow-y-auto"
                    placeholder="Your Message"
                  />
                  <img src={pencil} className="absolute top-5 left-4" />
                </div>

                <button className="btn w-full sm:w-[220px] h-[50px] rounded-xl border-0 self-stretch sm:self-center bg-[#D9176C] text-[17px] lg:text-[18px] text-[#FFFFFF] font-semibold">
                  Send Message
                </button>
              </Form>
            </Formik>
          </div>

          <div className="w-full lg:w-[312px] flex flex-col gap-5 lg:gap-[24px] self-start">
            <div className="w-full flex gap-[12px] items-start">
              <img src={phone} alt="" className="mt-1" />
              <p className="text-[15px] lg:text-[16px] text-[#FFFFFF] break-all">
                01123456789
              </p>
            </div>

            <div className="w-full flex gap-[12px] items-start">
              <img src={email} alt="" className="mt-1" />
              <p className="text-[15px] lg:text-[16px] text-[#FFFFFF] break-all">
                Example@gmail.com
              </p>
            </div>

            <div className="w-full flex gap-[12px] items-start">
              <img src={location} alt="" className="mt-1" />
              <p className="text-[15px] lg:text-[16px] w-full lg:w-[248px] leading-7 text-[#FFFFFF]">
                adipiscing elit. Mauris et ultricies est. Aliquam in justo varius,
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1200px] pb-[70px] lg:pb-[120px] pt-0 grid grid-cols-1 sm:grid-cols-2 lg:flex justify-center gap-6 lg:gap-[61px] items-start">
          {ShopAdvantages.map((el, index) => {
            return (
              <div
                key={index}
                className="w-full lg:w-[275px] bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 shadow-sm lg:shadow-none flex flex-col gap-4"
              >
                <img src={el.imgSrc} className="w-[30px]" alt="" />
                <h3 className="text-[#222222] text-[17px] lg:text-[18px] font-bold">
                  {el.header}
                </h3>
                <p className="w-full text-[15px] lg:text-[16px] font-normal leading-7 text-[#8c8c8c]">
                  {el.details}
                </p>
              </div>
            )
          })}
        </div>
      </div>
       <MobileFooter></MobileFooter>
    </>
  )
}