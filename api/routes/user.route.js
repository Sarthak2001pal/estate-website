import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();    // Create a new router
router.get('/test', test);    // Create a new route with the path /test
export default router;    // Export the router