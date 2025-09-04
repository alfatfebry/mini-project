import mysgl from "mysql2/promise"

const pool = mysgl.createPool({
  host: "localhost",
  user: "root",
  password:"123456",
  database:"schools_db"

});

export default pool;