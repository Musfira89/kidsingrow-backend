import express from 'express';
import { generateAndSaveReport} from '../Controllers/reportController.js';
import {getReportMetadata, servePDF , approveReport , declineReport , getReportByChildId, getLatestReportByChildId } from '../Controllers/report.js';

const router = express.Router();

router.post('/generate-report', generateAndSaveReport);
router.get('/reports/metadata', getReportMetadata); // Add this line

router.get('/reports/pdf/:id', servePDF); // Note: This should match `/api/reports/pdf/:id`
router.post('/reports/approve/:id', approveReport);
router.post('/reports/decline/:id', declineReport);
router.get('/reports/:childId', getReportByChildId);
router.get('/reports/latest/:childId', getLatestReportByChildId);

export default router;
