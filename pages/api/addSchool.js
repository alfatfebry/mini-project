import db from "@/lib/db"; // sesuaikan dengan path koneksi MySQL kamu

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, address, city, state, contact, email_id, image } = req.body;

      if (!name || !address || !city || !state || !contact || !email_id || !image) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const [result] = await db.query(
        "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, address, city, state, contact, email_id, image]
      );

      res.status(200).json({ success: true, id: result.insertId });
    } catch (err) {
      console.error("Error inserting school:", err);
      res.status(500).json({ error: "Database insert failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
