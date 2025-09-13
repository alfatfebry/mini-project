// pages/api/auth/send-otp.js
import { Pool } from "pg";
import { sendBrevoOTP } from "../../../lib/sendBrevoOTP";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    // save/update OTP ke DB
    await pool.query(
      `
      INSERT INTO users (email, otp_code, otp_expiry)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET otp_code = $2, otp_expiry = $3
    `,
      [email, otp, expiry]
    );

    // kirim OTP via Brevo API
    await sendBrevoOTP(email, otp);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}
