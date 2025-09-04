import pool from '../../lib/db';
import cloudinary from 'cloudinary';


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, address, city, state, contact, email_id, imageBase64 } = req.body;

  if (!name || !address || !city || !state || !contact || !email_id || !imageBase64) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // upload image ke Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(imageBase64, {
      folder: 'schools',
      resource_type: 'image',
    });

    const imageUrl = uploadResponse.secure_url;

    // insert ke Postgres
    const result = await pool.query(
      `INSERT INTO schools (name, address, city, state, contact, image, email_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, address, city, state, contact, imageUrl, email_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
