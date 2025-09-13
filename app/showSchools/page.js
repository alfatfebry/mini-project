"use client";

import { useEffect, useState } from "react";
import AddSchool from "../../components/AddSchool";
import Modal from "../../components/Modal";
import LoginForm from "../../components/LoginForm";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 👇 default false, nanti di-set true kalau user belum login
  const [showLogin, setShowLogin] = useState(false);

  const fetchSchools = async () => {
    try {
      const res = await fetch("/api/getSchool");
      const result = await res.json();
      if (result.success) {
        setSchools(result.data);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 cek session login di awal
  const checkLogin = async () => {
    try {
      const res = await fetch("/api/auth/check-session", {
        credentials: "include",
      });
      const data = await res.json();

      if (!data.loggedIn) {
        setShowLogin(true); // kalau belum login → munculin modal
      }
    } catch (err) {
      console.error("Error checking session:", err);
      setShowLogin(true); // fallback kalau error → anggap belum login
    }
  };

  useEffect(() => {
    checkLogin();
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

      {/* Modal Login (only if not logged in) */}
      <Modal isOpen={showLogin} onClose={() => {}}>
        <LoginForm
          onLoginSuccess={() => {
            setShowLogin(false); // kalau login sukses → tutup modal
          }}
        />
      </Modal>
    </div>
  );
}
