import pool from "../../lib/db";


export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, address, city, image FROM schools ORDER BY id DESC"
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.log("Error fetching:", err);
    res.status(500).json({ success: false, error: "Database Error" });
  }
}
