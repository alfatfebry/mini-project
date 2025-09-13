if (new Date(user.otp_expiry) < now) {
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

// clear OTP biar ga reusable
await pool.query(
  "UPDATE users SET otp_code = NULL, otp_expiry = NULL WHERE email = $1",
  [email]
);

// set cookie
res.setHeader(
  "Set-Cookie",
  cookie.serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  })
);

return res.status(200).json({ message: "Login berhasil", token });
