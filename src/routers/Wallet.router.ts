import express from "express";
import walletController from "../controllers/Wallet.controller";

const walletRouter = express.Router();

walletRouter.post('/users/wallets', walletController.createWallet);
walletRouter.get('/users/:userID/wallets', walletController.getWalletList); // Lấy info all ví của user
walletRouter.get('/users/:userID/wallets/:walletID', walletController.getWallet); // Lấy info 1 ví của user
walletRouter.put('/users/:userID/wallets/:walletID', walletController.updateWallet);
walletRouter.delete('/users/:userID/wallets/:walletID', walletController.deleteWallet);

export default walletRouter;