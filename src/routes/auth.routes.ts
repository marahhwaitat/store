import * as express from 'express';
const router = express.Router();
import { signup, login, resetPassword ,resetPasswordRequest } from'../controllers/auth.controller';

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post('/request-password-reset', resetPasswordRequest);
export default router;
