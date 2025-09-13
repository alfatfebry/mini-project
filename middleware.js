import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value; 
  const { pathname } = req.nextUrl;

  // paths
  const publicPaths = ["/", "/login", "/register", "/api/auth", "/schools"];
  const isPublic = publicPaths.some(path => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
