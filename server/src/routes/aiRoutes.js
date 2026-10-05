import { Router } from 'express';
import { getHealth, askStudyBuddy, generateQuiz, generateStudyPlan } from '../controllers/aiController.js';
import { validateAskRequest, validateQuizRequest, validateStudyPlanRequest } from '../middleware/validateRequest.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// Study Assistant ask endpoint (Explain, Simplify, Practice, Exam Revision)
router.post('/ai/ask', validateAskRequest, askStudyBuddy);

// Interactive Quiz generator endpoint
router.post('/ai/quiz', validateQuizRequest, generateQuiz);

// Study Plan schedule generator endpoint
router.post('/ai/study-plan', validateStudyPlanRequest, generateStudyPlan);

export default router;
