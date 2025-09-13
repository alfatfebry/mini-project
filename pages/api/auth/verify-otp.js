import { Pool } from "pg";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, otp } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    const now = new Date();

    if (!user) {
      return res.status(400).json({ error: "User tidak ditemukan" });
    }

    if (!user.otp_code || new Date(user.otp_expiry) < now) {
      return res.status(400).json({ error: "OTP sudah expired" });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ error: "OTP salah" });
    }

    // generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // clear OTP
    await pool.query("UPDATE users SET otp_code=NULL, otp_expiry=NULL WHERE email=$1", [email]);

    // log token buat debug
    console.log("Generated token:", token);

    // set cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // di localhost -> false
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
      })
    );

    return res.status(200).json({ message: "Login berhasil" });
  } catch (err) {
    console.error("Error verify OTP:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
