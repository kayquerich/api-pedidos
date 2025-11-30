import { login } from "../controllers/Authentication.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/login', (req, res) => {
    try {
        const credentials = req.body;
        const result = login(credentials);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

export default authRouter;