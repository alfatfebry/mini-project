"use client";

import { useState } from "react";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ tambahan

  const handleSendOtp = async () => {
    setLoading(true); // mulai loading
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setMessage("OTP has been sent to your email");
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setMessage("Unexpected error, please try again");
    } finally {
      setLoading(false); // selesai loading
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful");
        onLoginSuccess?.();
      } else {
        setMessage(data.error || "Failed to verify OTP");
      }
    } catch (err) {
      setMessage("Unexpected error, please try again");
    } finally {
      setLoading(false);
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
            disabled={loading} // ⬅️ disable saat loading
            className={`w-full py-2 rounded cursor-pointer ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? "Sending..." : "Send OTP"}
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
            disabled={loading}
            className={`w-full py-2 rounded cursor-pointer ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {message && (
        <p className="mt-3 text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}
