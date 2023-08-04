import express from "express";
import userController from "../controllers/User.controller";

const userRouter = express.Router();

userRouter.post('/users', userController.createUser);
userRouter.post('/login', userController.login);
userRouter.get('/users', userController.getListUser);
userRouter.get('/users/:id/wallets', userController.getWalletList);

export default userRouter;