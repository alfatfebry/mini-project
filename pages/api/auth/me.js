import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    // verifikasi jwt
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isAuthenticated: true });
  } catch (err) {
    return res.status(200).json({ isAuthenticated: false });
  }
}
