import express from "express";
import WalletRoleController from "../controllers/WalletRole.controller";

const walletRoleRouter = express.Router();

walletRoleRouter.post('/walletRoles', WalletRoleController.createWalletRole);
walletRoleRouter.get('/walletRoles', WalletRoleController.getAll);

export default walletRoleRouter;