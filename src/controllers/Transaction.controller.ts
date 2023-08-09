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
            let walletRole = await WalletRoleController.getWalletRole(walletID, userID);
            if ((walletRole.role === "owner" || walletRole.role === "using") && walletRole.archived == false) {
                const {amount, date, note, categoryID} = req.body;
                let category = await TransactionController.categoryRoleRepository.findOneBy({id: +categoryID});
                let newTransaction = new Transaction();
                newTransaction.amount = +amount;
                newTransaction.note = note;
                newTransaction.date = date;
                newTransaction.category = category;
                newTransaction.walletRole = walletRole;
                let result = await TransactionController.transactionRepository.save(newTransaction);
                if (result) {
                    if (category.type === "expense") {
                        await WalletController.adjustAmountOfMoneyOfWallet(walletID, -amount);
                    } else {
                        await WalletController.adjustAmountOfMoneyOfWallet(walletID, +amount);
                    }
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

    static async getTransactionListByWalletID(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            const userID: number = +req.token.userID;
            let walletRole = await WalletRoleController.getWalletRole(walletID, userID);
            if (walletRole) {
                let transactionList = await TransactionController.transactionRepository.find({
                    relations: {
                        category: true,
                        walletRole: {
                            user: true
                        }
                    },
                    where: {
                        walletRole: {
                            wallet: {
                                id: walletID
                            }
                        }
                    }
                });
                if (transactionList.length) {
                    res.status(200).json({
                        message: "Get transaction list success!",
                        transactionList: transactionList
                    });
                } else {
                    res.status(200).json({
                        message: "No data!",
                        transactionList: transactionList
                    });
                }
            } else {
                res.status(200).json({
                    message: "No permission to get transaction list!"
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
            const userID: number = +req.token.userID;
            let walletRole = await WalletRoleController.getWalletRole(walletID, userID);
            if (walletRole) {
                const transactionID: number = +req.params.transactionID;
                let transaction = await TransactionController.transactionRepository.find({
                    relations: {
                        walletRole: {
                            wallet: true,
                            user: true
                        }
                    },
                    where: {
                        id: transactionID,
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
            } else {
                res.status(200).json({
                    message: "No permission to get transaction!"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async deleteTransaction(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            const userID: number = +req.token.userID;
            const transactionID: number = +req.params.transactionID;
            let transactionDeleted = await TransactionController.transactionRepository.find({
                relations: {
                    category: true,
                    walletRole: {
                        user: true
                    }
                },
                where: {
                    id: transactionID
                }
            });
            if (userID === transactionDeleted[0].walletRole.user.id && (transactionDeleted[0].walletRole.role === ("owner" || "using")) && transactionDeleted[0].walletRole.archived == false) {
                let deletedTransaction = await TransactionController.transactionRepository.delete({id: transactionID});
                if (transactionDeleted[0].category.type === 'expense') {
                    await WalletController.adjustAmountOfMoneyOfWallet(walletID, transactionDeleted[0].amount);
                } else {
                    await WalletController.adjustAmountOfMoneyOfWallet(walletID, -transactionDeleted[0].amount);
                }
                res.status(200).json({
                    message: "Delete transaction success!",
                    numberOfTransactionDeleted: deletedTransaction.affected
                });
            } else {
                res.json({
                    message: "No permission to delete!"
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