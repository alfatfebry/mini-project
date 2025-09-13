"use client";

import { useState } from "react";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include", // ⬅️ penting
    });
    const data = await res.json();
    if (res.ok) {
      setStep("otp");
      setMessage("OTP terkirim ke email");
    } else {
      setMessage(data.error || "Gagal kirim OTP");
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include", // ⬅️ penting
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Login berhasil");
      onLoginSuccess?.();
    } else {
      setMessage(data.error || "Gagal verifikasi OTP");
    }
  };

  return (
    <div className="p-2 md:p-6 ">
      <h2 className="text-3xl text-center font-bold mb-4">Login</h2>

      {step === "email" ? (
        <>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer"
          >
            Kirim OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Type your OTP"
            className="border p-2 w-full mb-3 text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded cursor-pointer"
          >
            Verifikasi OTP
          </button>
        </>
      )}

      {message && <p className="mt-3 text-sm text-gray-600 text-center">{message}</p>}
    </div>
  );
}
