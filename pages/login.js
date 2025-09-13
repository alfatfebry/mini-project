import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email → otp
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Kirim OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
        setMessage("OTP berhasil dikirim ke email kamu!");
      } else {
        setMessage(data.error || "Gagal mengirim OTP.");
      }
    } catch (err) {
      setMessage("Terjadi error saat mengirim OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verifikasi OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login berhasil! Mengalihkan...");
        window.location.href = "/add-school"; // redirect setelah login
      } else {
        setMessage(data.error || "OTP salah atau expired.");
      }
    } catch (err) {
      setMessage("Terjadi error saat verifikasi OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Login dengan OTP
        </h1>

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {loading ? "Mengirim OTP..." : "Kirim OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Masukkan OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              {loading ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>
          </form>
        )}

        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
