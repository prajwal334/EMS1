import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { addTeam, getTeams } from '../controllers/teamControl.js';


const router = express.Router();

router.get('/', authMiddleware, getTeams );
router.post('/add', authMiddleware, addTeam )

export default router;