import express from "express";
import TransactionController from "../controllers/Transaction.controller";

const transactionRouter = express.Router();

transactionRouter.post('/users/wallets/:walletID/transactions', TransactionController.createTransaction);
transactionRouter.get('/users/wallets/:walletID/transactions', TransactionController.getTransactionListByWalletID);
transactionRouter.get('/users/wallets/:walletID/transactions/:transactionID', TransactionController.getTransaction);
transactionRouter.delete('/users/wallets/:walletID/transactions/:transactionID', TransactionController.deleteTransaction);
transactionRouter.put('/users/wallets/:walletID/transactions/:transactionID', TransactionController.updateTransaction);
transactionRouter.get('/users/wallets/:walletID/report', TransactionController.getAllTransactionByTimeRange);
transactionRouter.get('/users/wallets/:walletID/search', TransactionController.searchAllTransactionByTimeRangeAndCategory);

export default transactionRouter;