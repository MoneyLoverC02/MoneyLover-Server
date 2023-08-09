import {Response} from "express";
import {CustomRequest} from "../middlewares/auth";
import {AppDataSource} from "../models/data-source";
import {Wallet} from "../models/entity/Wallet";
import {Category} from "../models/entity/Category";
import {WalletRole} from "../models/entity/WalletRole";
import {User} from "../models/entity/User";
import {Transaction} from "../models/entity/Transaction";
import WalletRoleController from "./WalletRole.controller";
import WalletController from "./Wallet.controller";

class TransactionController {
    static userRepository = AppDataSource.getRepository(User);
    static walletRepository = AppDataSource.getRepository(Wallet);
    static categoryRoleRepository = AppDataSource.getRepository(Category);
    static walletRoleRepository = AppDataSource.getRepository(WalletRole);
    static transactionRepository = AppDataSource.getRepository(Transaction);

    static async addTransaction(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            const userID: number = +req.token.userID;
            let userRole = await WalletRoleController.getRole(walletID, userID);
            if (userRole === "owner" || userRole === "using") {
                const {amount, date, note, categoryID} = req.body;
                let category = await TransactionController.categoryRoleRepository.findOneBy({id: +categoryID});
                let wallet = await TransactionController.walletRepository.findOneBy({id: walletID});
                let newTransaction = new Transaction();
                newTransaction.amount = +amount;
                newTransaction.note = note;
                newTransaction.date = date;
                newTransaction.category = category;
                newTransaction.wallet = wallet;
                let result = await TransactionController.transactionRepository.save(newTransaction);
                if (result) {
                    await WalletController.adjustAmountOfMoneyOfWallet(walletID, amount, category.type);
                    res.status(200).json({
                        message: "Creat transaction success!",
                        newTransaction: result
                    });
                }
            } else {
                res.json({
                    message: "No permission to add transaction!",
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getTransactionList(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            let transactionList = await TransactionController.transactionRepository.find({
                relations: {
                    wallet: true
                },
                where: {
                    wallet: {
                        id: walletID
                    }
                }
            });
            if (transactionList.length) {
                res.status(200).json({
                    message: "Get transactionList success!",
                    transactionList: transactionList
                });
            } else {
                res.status(200).json({
                    message: "No data!",
                    transactionList: transactionList
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getTransaction(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            const transactionID: number = +req.params.transactionID;
            let transaction = await TransactionController.transactionRepository.find({
                relations: {
                    wallet: true
                },
                where: {
                    id: transactionID,
                    wallet: {
                        id: walletID
                    }
                }
            });
            if (transaction.length) {
                res.status(200).json({
                    message: "Get transaction success!",
                    transaction: transaction[0]
                });
            } else {
                res.status(200).json({
                    message: "No data!",
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default TransactionController;