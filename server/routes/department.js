import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { addDepartment, getDepartments } from '../controllers/departmentControl.js';


const router = express.Router();

router.get('/', authMiddleware, getDepartments );
router.post('/add', authMiddleware, addDepartment )

export default router;