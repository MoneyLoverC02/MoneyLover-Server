import express from "express";
import auth from "../middlewares/auth";
import WalletController from "../controllers/Wallet.controller";

const walletRouter = express.Router();
walletRouter.use(auth);

walletRouter.post('/users/wallets', WalletController.createWallet);
walletRouter.get('/users/wallets', WalletController.getWalletList); // Lấy info all ví của user
walletRouter.get('/users/wallets/:walletID', WalletController.getWallet); // Lấy info 1 ví của user
walletRouter.put('/users/wallets/:walletID', WalletController.updateWallet);
walletRouter.delete('/users/wallets/:walletID', WalletController.deleteWallet);
walletRouter.post('/users/wallets/:walletID/transfer', WalletController.transferMoneyToAnotherWallet);
walletRouter.post('/users/wallets/:walletID/archived', WalletController.archivedWallet);

export default walletRouter;