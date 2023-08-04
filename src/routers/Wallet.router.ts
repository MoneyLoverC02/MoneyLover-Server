import express from "express";
import walletController from "../controllers/Wallet.controller";

const walletRouter = express.Router();

walletRouter.post('/wallets', walletController.createWallet);
// walletRouter.get('/wallets/:id', walletController.getWallet)
walletRouter.put('/wallets/:id', walletController.updateWallet);

export default walletRouter;