import { Outlet } from "react-router-dom";
import BooksHeader from "../components/BooksHeader";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";

export default function BooksLyout() {
  return (
    <div className="flex flex-col bg-[#F5F5F5] ">
        <MainHeader hidden={'hidden'}/>
        <main className="min-h-screen">
            
        <Outlet/>

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
