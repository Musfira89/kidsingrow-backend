//questionnaireRoutes.js

import express from 'express';
import { getQuestions } from '../Controllers/question.js';
import { getOptions } from '../Controllers/option.js'; // Import the new options controller

const router = express.Router();

router.get('/months/:month/categories/:category/questions', getQuestions);
router.get('/questions/:questionId/options', getOptions); // New route for fetching options

export default router;
