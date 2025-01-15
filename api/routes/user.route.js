import express from 'express';
import { test, updateUserInfo } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();    // Create a new router
router.get('/test', test);    // Create a new route with the path /test
router.post('/update/:id', verifyToken ,updateUserInfo);    // Create a new route with the path /update/:id
export default router;    // Export the router