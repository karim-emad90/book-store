
export default function ProductLayout() {
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
