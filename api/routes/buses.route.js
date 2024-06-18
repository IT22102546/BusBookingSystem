import express from 'express';
import { getBuses } from '../controllers/buses.controller.js';


const router = express.Router();
router.get('/getbuses',getBuses);

export default router;