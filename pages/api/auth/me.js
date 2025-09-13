import jwt from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    console.log("Cookies received:", cookies);

    const token = cookies.token;
    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    return res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(200).json({ isAuthenticated: false });
  }
}
