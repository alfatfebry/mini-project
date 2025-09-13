// pages/api/auth/send-otp.js
import nodemailer from "nodemailer";
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    let result;

    // 1. Cek kalau ada RESEND_API_KEY
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      result = await resend.emails.send({
        from: "School App <no-reply@yourdomain.com>",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      });

      return res.status(200).json({ success: true, service: "resend", result });
    }

    // 2. Kalau RESEND tidak ada → fallback pakai Brevo SMTP
    if (process.env.BREVO_USER && process.env.BREVO_API_KEY) {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_API_KEY,
        },
      });

      await transporter.sendMail({
        from: `"School App" <${process.env.BREVO_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
      });

      return res.status(200).json({ success: true, service: "brevo" });
    }

    // 3. Kalau dua-duanya nggak ada
    return res.status(500).json({
      success: false,
      message: "No email provider configured (RESEND_API_KEY or BREVO creds required).",
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
