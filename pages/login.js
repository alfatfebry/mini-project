// frontend login.js (Next.js)
const sendOtp = async (email, otp) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }), // << WAJIB ada ini
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }
    console.log("OTP sent via:", data.service);
    return data;
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw err;
  }
};
