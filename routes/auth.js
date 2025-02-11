import express from 'express';
import { signup, login, logout, Adminlogin } from '../Controllers/auth.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/Adminlogin', Adminlogin);
router.post('/logout', logout);

export default router;
