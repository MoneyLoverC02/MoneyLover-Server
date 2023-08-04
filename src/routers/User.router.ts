import express from "express";
import userController from "../controllers/User.controller";

const userRouter = express.Router();

userRouter.post('/users',userController.createUser);
userRouter.get('/users', userController.getListUser);
userRouter.get('/users/:id', userController.getUser);

export default userRouter;