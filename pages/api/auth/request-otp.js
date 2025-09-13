import { Pool } from "pg";
import nodemailer from "nodemailer";

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

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Insert or update user with OTP
    await pool.query(
      `
      INSERT INTO users (email, otp_code, otp_expiry)
      VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
      ON CONFLICT (email)
      DO UPDATE SET otp_code = EXCLUDED.otp_code, otp_expiry = EXCLUDED.otp_expiry
      `,
      [email, otp]
    );

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"School App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
