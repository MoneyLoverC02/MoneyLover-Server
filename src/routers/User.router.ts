import express from "express";
import userController from "../controllers/User.controller";

const userRouter = express.Router();

userRouter.post('/users',userController.createUser);

export default userRouter;