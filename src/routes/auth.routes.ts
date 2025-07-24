import * as express from 'express';
const router = express.Router();
import { signup, login, resetPassword ,resetPasswordRequest } from'../controllers/auth.controller';

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password/otp", resetPassword);
router.post('/request-password/set', resetPasswordRequest);
export default router;
