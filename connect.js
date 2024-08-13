import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
export const db = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  port:process.env.MYSQL_ADDON_PORT,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  uri : process.env.MYSQL_ADDON_URI
  });

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database");
});

export const dbPromise = db.promise();