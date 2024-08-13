//childFormRoutes.js

import express from 'express';
import { submitChildForm, getChildData } from '../Controllers/childForm.js';

const router = express.Router();

router.post('/submit', submitChildForm);
router.get('/:childId', getChildData); // New route to fetch child data by ID


export default router;