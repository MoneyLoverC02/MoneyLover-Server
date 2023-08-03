import express from "express";
import WalletRoleController from "../controllers/WalletRole.controller";

const walletRoleRouter = express.Router();

walletRoleRouter.post('/walletRoles', WalletRoleController.createWalletRole);

export default walletRoleRouter;