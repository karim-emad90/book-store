import BeforeLogin from "./BeforeLogin";

export default function AfterLogin() {
  return (
    <div className="h-full w-full lg:max-w-full mx-auto  bg-[#F5F5F5] flex flex-col gap-[10px]">
      <BeforeLogin/>
    </div>
  )
}
