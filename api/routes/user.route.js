import express  from 'express';
import {deleteUser, test} from '../controllers/user.controller.js';
import {updateUserInfo} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();
router.get('/test', test);
router.put('/update/:id',verifyToken ,updateUserInfo)
router.delete('/delete/:id',verifyToken ,deleteUser)
export default router;