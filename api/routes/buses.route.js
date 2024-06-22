import express from 'express';
import { create, deleteBus, getBusById, getBuses, getCompanies, getStations, getallBuses, updatebus } from '../controllers/buses.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();
router.post('/create', verifyToken, create);
router.get('/getbuses',getBuses);
router.get('/getallbuses',getallBuses);
router.get('/getbus/:busId', getBusById);
router.get('/stations', getStations);
router.put('/updatebus/:busId/:userId', verifyToken, updatebus)
router.delete('/deletebus/:busId/:userId', verifyToken, deleteBus);
router.get('/companies', getCompanies);


export default router;