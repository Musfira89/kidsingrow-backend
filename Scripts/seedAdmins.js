import mysql from "mysql2/promise";
import bcrypt from 'bcrypt';

// Create a MySQL connection pool
export const db = mysql.createPool({
  host: "localhost",
  port: 4036, // Update port number to 4036
  user: "root",
  password: "", // Add your MySQL password here
  database: "kidsingrow"
});

const username = 'aisha';
const plainPassword = '123456789';

// Hash the password using bcrypt
bcrypt.hash(plainPassword, 10, async (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  const sql = 'INSERT INTO admins (username, password) VALUES (?, ?)';
  try {
    const [result] = await db.query(sql, [username, hashedPassword]);
    console.log('Admin user inserted successfully:', result);
  } catch (err) {
    console.error('Error inserting admin user:', err);
  }
});
