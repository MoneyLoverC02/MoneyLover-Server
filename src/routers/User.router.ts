import express from "express";
import UserController from "../controllers/User.controller";
import auth from "../middlewares/auth";

const userRouter = express.Router();
userRouter.use(auth);

userRouter.get('/users', UserController.getListUser);
userRouter.delete('/users', UserController.deleteUser);
userRouter.put('/users', UserController.updateUser);

export default userRouter;