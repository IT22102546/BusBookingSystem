import express from 'express';
import { getBuses, getStations } from '../controllers/buses.controller.js';


const router = express.Router();
router.get('/getbuses',getBuses);
router.get('/stations', getStations);

export default router;