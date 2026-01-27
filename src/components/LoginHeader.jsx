import { Link } from 'react-router-dom';
import bookIcon from '../assets/LoginPage/book-bookmark 1.png';
import libraryBackGround from '../assets/LoginPage/library-background.png';

export default function LoginHeader() {
  return (
    <div className="w-full h-[383px] flex flex-col">
      <div className="w-full h-[92px] z-10 text-[#FFFFFF] bg-[#FFFFFF33] flex items-center justify-between px-[140px]">
        <div className="w-full lg:w-[427px] text-[18px] font-semibold items-center flex flex-col lg:flex-row gap-[40px]">
          <section className="w-[20%] gap-[8px] flex justify-center items-center">
            <img src={bookIcon} alt="bookIcon" />
            <h4 className="text-[16px] font-light">Bookshop</h4>
          </section>
          <Link>Home</Link>
          <Link>Books</Link>
          <Link>About us</Link>
        </div>

        <div className="w-full lg:w-[182px] flex justify-between items-center">
          <button className="btn w-[29px] lg:w-[79px] h-[44px] bg-[#D9176C] border-0">
            Log in
          </button>
          <button className="btn w-[49px] lg:w-[79px] h-[44px] bg-[#FFFFFF] text-[#D9176C] border border-[#D9176C]">
            Log in
          </button>
        </div>
      </div>

      <div
        className="w-full h-[338px] absolute top-0 left-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${libraryBackGround})`, container: 'full' }}
      ></div>
    </div>
  );
}
