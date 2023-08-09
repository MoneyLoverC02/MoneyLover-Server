import express from "express";
import TransactionController from "../controllers/Transaction.controller";
import auth from "../middlewares/auth";

const transactionRouter = express.Router();
transactionRouter.use(auth);

transactionRouter.post('/users/wallets/:walletID/transactions', TransactionController.addTransaction);
transactionRouter.get('/users/wallets/:walletID/transactions', TransactionController.getTransactionList);
transactionRouter.get('/users/wallets/:walletID/transactions/:transactionID', TransactionController.getTransaction);

export default transactionRouter;