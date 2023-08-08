import express from "express";
import auth from "../middlewares/auth";
import WalletRoleController from "../controllers/WalletRole.controller";

const walletRoleRouter = express.Router();
walletRoleRouter.use(auth);

walletRoleRouter.post('/users/walletRoles', WalletRoleController.createWalletRole);

export default walletRoleRouter;