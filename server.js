// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import questionnaireRoutes from './routes/questionnaireRoutes.js';
import authRoutes from './routes/auth.js';
import session from 'express-session';
import childFormRoutes from './routes/childFormRoute.js';
import responseRoutes from './routes/responseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import graphRoutes from './routes/graphRoutes.js';
import questionRoutes from './routes/questionRoutes.js'
import dotenv from 'dotenv';


dotenv.config();
const app = express();
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SECRET_KEY, // Use the environment variable for the secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api', childFormRoutes);
app.use('/api', questionnaireRoutes);
app.use('/api', responseRoutes);
app.use('/api', reportRoutes);
app.use('/api', graphRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
