import express from 'express';
import { saveResponse , getResponses } from '../Controllers/responses.js';

const router = express.Router();

router.post('/responses', saveResponse);
router.get('/responses/:childId', getResponses);

export default router;