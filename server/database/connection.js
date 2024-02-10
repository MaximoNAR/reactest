import mysql from "mysql";


const pool = mysql.createPool({
  connectionLimit: 10, 
  host: "localhost",
  database: "reactest",
  user: "root",
})

export default pool;