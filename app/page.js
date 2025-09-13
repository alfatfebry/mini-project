import AddSchool from "@/pages/addSchool";
import ShowSchools from "@/pages/showSchools";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* <AddSchool /> */}
      <ShowSchools />
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2xl p-6 relative">
          <h2 className="text-xl font-bold">HARDCODE MODAL</h2>
          <p>Ini harus nongol di Vercel kalau render jalan.</p>
        </div>
      </div>
    </>
  );
}
