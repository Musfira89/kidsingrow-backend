import express from 'express';
import { fetchGraphData } from '../Controllers/fetchGraphData.js'; 

const router = express.Router();

router.get('/graph-data/:childId', fetchGraphData);

export default router;
