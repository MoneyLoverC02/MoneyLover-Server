import express from "express";
import userController from "../controllers/User.controller";
import auth from "../middlewares/auth";

const userRouter = express.Router();
userRouter.use(auth);

userRouter.get('/users', userController.getListUser);
userRouter.delete('/users/:userID', userController.deleteUser);
userRouter.put('/users/:userID', userController.updateUser);

export default userRouter;