import express from "express";
import TransactionController from "../controllers/Transaction.controller";
import auth from "../middlewares/auth";

const transactionRouter = express.Router();
transactionRouter.use(auth);

transactionRouter.post('/users/wallets/:walletID/transactions', TransactionController.addTransaction);

export default transactionRouter;