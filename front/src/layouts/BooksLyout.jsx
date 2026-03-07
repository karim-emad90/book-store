import { Outlet } from "react-router-dom";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";
import { useState } from "react";

export default function BooksLyout() {
  const [search,setSearch] = useState('');
  return (
    <div className="flex flex-col bg-[#F5F5F5] ">
        <MainHeader hidden={'hidden'}
                    search={search}
                    setSearch={setSearch}
        />
        <main className="min-h-screen"
        >
            
        <Outlet context={{ search, setSearch }} />

        </main>
        <MainFooter></MainFooter>
    </div>
  )
}
