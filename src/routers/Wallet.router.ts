import express from "express";
import walletController from "../controllers/Wallet.controller";

const walletRouter = express.Router();

walletRouter.post('/wallets', walletController.createWallet); //ok
walletRouter.get('/wallets', walletController.getWalletList); //ok
walletRouter.get('/wallets/:id', walletController.getWallet111) //ok
walletRouter.get('/wallets/:id', walletController.getWallet) //ok

export default walletRouter;