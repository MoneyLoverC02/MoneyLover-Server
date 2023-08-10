import express from "express";
import userController from "../controllers/User.controller";

const authRouter = express.Router();

authRouter.post('/register',userController.createUser);
authRouter.post('/login', userController.login);

export default authRouter;