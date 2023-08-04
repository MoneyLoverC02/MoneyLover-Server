import express from "express";
import walletController from "../controllers/Wallet.controller";

const walletRouter = express.Router();

walletRouter.post('/wallets', walletController.createWallet);
walletRouter.get('/users/:userID/wallets', walletController.getWalletList); // Lấy info all ví của user
walletRouter.get('/users/:userID/wallets/:walletID', walletController.getWallet); // Lấy info 1 ví của user
walletRouter.put('/users/:userID/wallets/:walletID', walletController.updateWallet);

export default walletRouter;