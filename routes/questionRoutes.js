import express from 'express';
import { addQuestion } from '../Controllers/questionController.js';


const router = express.Router();

router.post('/add', addQuestion);


export default router;
