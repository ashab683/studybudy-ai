import { Router } from 'express';
import { getHealth, askStudyBuddy } from '../controllers/aiController.js';
import { validateAskRequest } from '../middleware/validateRequest.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// Study Assistant ask endpoint
router.post('/ai/ask', validateAskRequest, askStudyBuddy);

export default router;
