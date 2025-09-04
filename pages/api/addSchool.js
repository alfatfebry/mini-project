import { v2 as cloudinary } from "cloudinary";
import mysql from "mysql2/promise";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, address, city, state, contact, email_id, imageBase64 } = req.body;

    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    let imageUrl = null;

    if (imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "schools",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // DB connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [result] = await connection.execute(
      "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, address, city, state, contact, email_id, imageUrl]
    );

    await connection.end();

    return res.status(200).json({
      success: true,
      message: "School added successfully",
      insertedId: result.insertId,
      imageUrl,
    });
  } catch (error) {
    console.error("Error in addSchool API:", error);
    return res.status(500).json({ success: false, error: error.message });
  }

  
}
console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  port: process.env.DB_PORT,
});