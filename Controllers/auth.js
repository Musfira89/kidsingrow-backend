// controllers/authController.js
import bcrypt from 'bcrypt';
import { dbPromise } from '../connect.js';

// Signup controller
export const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    // Check if user already exists
    const checkUserSql = "SELECT * FROM signup WHERE username = ?";
    const [existingUsers] = await dbPromise.query(checkUserSql, [username]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    // Insert user into database
    const sql = "INSERT INTO signup (username, password) VALUES (?, ?)";
    const values = [username, hashedPassword];
    await dbPromise.query(sql, values);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// Login controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    // Check if user exists
    const sql = "SELECT * FROM signup WHERE username = ?";
    const [results] = await dbPromise.query(sql, [username]);

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const user = results[0];
    
    
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    console.log('Password Match:', match);

    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Check for existing child profile
    const childProfileSql = "SELECT child_id FROM child_form WHERE parentName = ?";
    const [childProfileResults] = await dbPromise.query(childProfileSql, [username]);

    const child_id = childProfileResults.length > 0 ? childProfileResults[0].child_id : null;

    // Respond with user info and child_id if exists
    res.status(200).json({ user: user, child_id: child_id });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const Adminlogin = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username); // Debugging

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const sql = 'SELECT * FROM admins WHERE username = ?';
    const [results] = await dbPromise.query(sql, [username]);

    console.log('Database results:', results); // Debugging

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const admin = results[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (isPasswordValid) {
      res.json({ isAdmin: true });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error:', err.message); // Debugging
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
};