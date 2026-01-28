import { Outlet } from "react-router-dom";
import BooksHeader from "../components/BooksHeader";
import MainFooter from "../components/MainFooter";

export default function BooksLyout() {
  return (
    <div className="flex flex-col bg-[#F5F5F5] gap-20 lg:gap-20">
        <BooksHeader/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
