import mysql from "mysql2/promise";

// const isProd = process.env.NODE_ENV === "production";

// const pool = mysql.createPool({
//   host: isProd ? process.env.DB_HOST : "127.0.0.1",
//   user: isProd ? process.env.DB_USER : "root",
//   password: isProd ? process.env.DB_PASS : "123456",
//   database: isProd ? process.env.DB_NAME : "schools_db",
//   port: isProd ? process.env.DB_PORT : 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
 
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
