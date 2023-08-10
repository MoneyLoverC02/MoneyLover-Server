import express from "express";
import TransactionController from "../controllers/Transaction.controller";
import auth from "../middlewares/auth";

const transactionRouter = express.Router();
transactionRouter.use(auth);

transactionRouter.post('/users/wallets/:walletID/transactions', TransactionController.addTransaction);
transactionRouter.get('/users/wallets/:walletID/transactions', TransactionController.getTransactionListByWalletID);
transactionRouter.get('/users/wallets/:walletID/transactions/:transactionID', TransactionController.getTransaction);
transactionRouter.delete('/users/wallets/:walletID/transactions/:transactionID', TransactionController.deleteTransaction);
transactionRouter.put('/users/wallets/:walletID/transactions/:transactionID', TransactionController.updateTransaction);

export default transactionRouter;