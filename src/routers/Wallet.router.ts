import express from "express";
import walletController from "../controllers/Wallet.controller";

const walletRouter = express.Router();

walletRouter.post('/wallets',walletController.createWallet);
walletRouter.get('/wallets', walletController.getWalletList);

export default walletRouter;