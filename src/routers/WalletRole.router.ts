import express from "express";
import WalletRoleController from "../controllers/WalletRole.controller";

const walletRoleRouter = express.Router();

walletRoleRouter.post('/users/walletRoles', WalletRoleController.createWalletRole);
walletRoleRouter.get('/users/:userID/walletRoles', WalletRoleController.getWalletRoleList); // Lấy info all ví của user

export default walletRoleRouter;