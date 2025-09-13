"use client";

import AddSchool from "@/components/AddSchool";
import Modal from "@/components/Modal";
import LoginForm from "@/components/LoginForm";
import { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 👇 selalu true supaya modal login muncul langsung
  const [showLogin, setShowLogin] = useState(true);

  const fetchSchools = async () => {
    try {
      const res = await fetch("/api/getSchool");
      const result = await res.json();
      if (result.success) {
        setSchools(result.data);
      } else {
        console.error("Fail fetch data", result.error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading .....</p>;
  }

  return (
    <div className="p-8 md:w-4/5 m-auto shadow-xl">
      <h2 className="mb-6 flex">
        <span className="text-2xl md:text-3xl font-bold">List Of Schools</span>

        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-auto bg-blue-500 text-white font-bold p-2 rounded cursor-pointer"
        >
          + Add School
        </button>
      </h2>

      {schools.length === 0 ? (
        <p className="text-center text-gray-500">Empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school.id}
              className="border rounded-lg shadow-md bg-white overflow-hidden"
            >
              <div className="bg-gray-300">
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-auto m-auto"
                />
              </div>
              <div className="p-4 flex flex-col gap-4">
                <h2 className="text-xl font-semibold">{school.name}</h2>
                <p>Address: {school.address}</p>
                <p>City: {school.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add School */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddSchool
          onSuccess={() => {
            setIsModalOpen(false);
            fetchSchools();
          }}
        />
      </Modal>

      {/* Modal Login (langsung muncul default) */}
      <Modal isOpen={showLogin} onClose={() => {}}>
        <LoginForm
          onLoginSuccess={() => {
            setShowLogin(false);
          }}
        />
      </Modal>
    </div>
  );
}
{/* TEST Modal Hardcode */}
<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
  <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2xl p-6 relative">
    <h2 className="text-xl font-bold">HARDCODE MODAL</h2>
    <p>Kalau ini nongol di Vercel → masalahnya di state/showLogin.</p>
  </div>
</div>
