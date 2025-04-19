import express from 'express';
import { googleAuth, signin, signout, signup } from '../controllers/auth.controller.js';    

const router = express.Router();

router.post("/signup",signup)
router.post("/signin",signin) // Uncomment when signin controller is implemented
router.post("/google", googleAuth)
router.get('/signout', signout)

export default router;