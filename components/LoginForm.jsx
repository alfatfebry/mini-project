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
      credentials: "include", // ⬅️ important
    });
    const data = await res.json();
    if (res.ok) {
      setStep("otp");
      setMessage("OTP has been sent to your email.");
    } else {
      setMessage(data.error || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include", // ⬅️ important
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Login successful.");
      onLoginSuccess?.();
    } else {
      setMessage(data.error || "OTP verification failed.");
    }
  };

  return (
    <div className="p-2 md:p-6 ">
      <h2 className="text-3xl text-center font-bold mb-4">Login</h2>

      {step === "email" ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full mb-3 text-center"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter your OTP"
            className="border p-2 w-full mb-3 text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded cursor-pointer"
          >
            Verify OTP
          </button>
        </>
      )}

      {message && (
        <p className="mt-3 text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}
