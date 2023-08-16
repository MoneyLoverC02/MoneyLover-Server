import { Response } from "express";
import { CustomRequest } from "../middlewares/auth";
import { AppDataSource } from "../models/data-source";
import { Wallet } from "../models/entity/Wallet";
import { Category } from "../models/entity/Category";
import { WalletRole } from "../models/entity/WalletRole";
import { User } from "../models/entity/User";
import { Transaction } from "../models/entity/Transaction";
import WalletRoleController from "./WalletRole.controller";
import WalletController from "./Wallet.controller";
import { Between, LessThan, LessThanOrEqual } from "typeorm";

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
            if ((walletRole.role === "owner" || walletRole.role === "using") && !walletRole.archived) {
                const { amount, date, note, categoryID } = req.body;
                let category: Category = await TransactionController.categoryRoleRepository.findOneBy({ id: +categoryID });
                let newTransaction: Transaction = new Transaction();
                newTransaction.amount = +amount;
                newTransaction.note = note;
                newTransaction.date = date;
                newTransaction.category = category;
                newTransaction.walletRole = walletRole;
                let result: Transaction = await TransactionController.transactionRepository.save(newTransaction);
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
            let walletRole: WalletRole | undefined = await WalletRoleController.getWalletRole(walletID, userID);
            if (walletRole) {
                let transactionList = await TransactionController.transactionRepository.find({
                    relations: {
                        category: true,
                        walletRole: {
                            user: true,
                            wallet: true
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
            const userID: number = req.token.userID;
            let walletRole: WalletRole | undefined = await WalletRoleController.getWalletRole(walletID, userID);
            if (walletRole) {
                const transactionID: number = +req.params.transactionID;
                let transaction = await TransactionController.transactionRepository.find({
                    relations: {
                        category: true,
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
            let transactionDeleted: Transaction[] = await TransactionController.transactionRepository.find({
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
            if (userID === transactionDeleted[0].walletRole.user.id && (transactionDeleted[0].walletRole.role === "owner" || transactionDeleted[0].walletRole.role === "using") && transactionDeleted[0].walletRole.archived == false) {
                let deletedTransaction = await TransactionController.transactionRepository.delete({ id: transactionID });
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

    static async updateTransaction(req: CustomRequest, res: Response) {
        try {
            let walletID: number = +req.params.walletID;
            let userID: number = req.token.userID;
            const transactionID: number = +req.params.transactionID;
            let updatedTransaction: Transaction[] = await TransactionController.transactionRepository.find({
                relations: {
                    category: true,
                    walletRole: {
                        user: true,
                        wallet: true
                    }
                },
                where: {
                    id: transactionID
                }
            });
            if (userID === updatedTransaction[0].walletRole.user.id && (updatedTransaction[0].walletRole.role === "owner" || updatedTransaction[0].walletRole.role === "using") && updatedTransaction[0].walletRole.archived == false) {
                let oldAmount: number = updatedTransaction[0].amount;
                const { amount, date, note, categoryID } = req.body;
                updatedTransaction[0].amount = +amount;
                updatedTransaction[0].note = note;
                updatedTransaction[0].date = date;
                let newCategory: Category = await TransactionController.categoryRoleRepository.findOneBy({ id: +categoryID });
                let oldCategoryType: string = updatedTransaction[0].category.type;
                let newCategoryType: string = newCategory.type;
                let caseAdjustAmountOfMoney = 0;
                if (updatedTransaction[0].category.id !== +categoryID) {
                    if (oldCategoryType !== newCategoryType) {
                        if (oldCategoryType === 'expense') caseAdjustAmountOfMoney = 1;
                        else caseAdjustAmountOfMoney = 2;
                    } else {
                        if (oldCategoryType === 'expense') caseAdjustAmountOfMoney = 3;
                        else caseAdjustAmountOfMoney = 4;
                    }
                    updatedTransaction[0].category = newCategory;
                } else {
                    if (oldCategoryType === 'expense') caseAdjustAmountOfMoney = 3;
                    else caseAdjustAmountOfMoney = 4;
                }
                switch (caseAdjustAmountOfMoney) {
                    case 1:
                        await WalletController.adjustAmountOfMoneyOfWallet(walletID, +amount + oldAmount);
                        break;
                    case 2:
                        await WalletController.adjustAmountOfMoneyOfWallet(walletID, -amount - oldAmount);
                        break;
                    case 3:
                        await WalletController.adjustAmountOfMoneyOfWallet(walletID, -amount + oldAmount);
                        break;
                    case 4:
                        await WalletController.adjustAmountOfMoneyOfWallet(walletID, +amount - oldAmount);
                        break;
                }
                updatedTransaction[0].walletRole = await WalletRoleController.getWalletRole(walletID, userID);
                let result = await TransactionController.transactionRepository.save(updatedTransaction);
                res.status(200).json({
                    message: "Update transaction success!",
                    updatedTransaction: result[0]
                });
            } else {
                res.json({
                    message: "No permission to update!"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async deleteTransactionByWalletID(walletID: number) {
        try {
            let walletRoles: WalletRole[] = await TransactionController.walletRoleRepository.find({
                where: {
                    wallet: {
                        id: walletID
                    }
                }
            });
            for (const walletRole of walletRoles) {
                await TransactionController.transactionRepository.delete({
                    walletRole: {
                        id: walletRole.id
                    }
                });
            }
            return "Delete success";
        } catch (e) {
            return e.message;
        }
    }

    static async deleteTransactionByUserID(userID: number) {
        try {
            let walletRoles: WalletRole[] = await TransactionController.walletRoleRepository.find({
                where: {
                    user: {
                        id: userID
                    }
                }
            });
            for (const walletRole of walletRoles) {
                await TransactionController.transactionRepository.delete({
                    walletRole: {
                        id: walletRole.id
                    }
                });
            }
            return "Delete success";
        } catch (e) {
            return e.message;
        }
    }

    static async deleteTransactionByWalletRoleID(walletRoleID: number) {
        try {
            let transactionDeleted: Transaction[] = await TransactionController.transactionRepository.find({
                relations: {
                    category: true,
                    walletRole: {
                        wallet: true
                    }
                },
                where: {
                    walletRole: {
                        id: walletRoleID
                    }
                }
            });
            let deletedTransactions = await TransactionController.transactionRepository.delete({
                walletRole: {
                    id: walletRoleID
                }
            });
            if (transactionDeleted[0]) {
                let walletIDNeedAdjustAmountOfMoney: number = transactionDeleted[0].walletRole.wallet.id;
                let changeAmount: number = transactionDeleted[0].amount;
                if (transactionDeleted[0].category.type === 'expense') {
                    await WalletController.adjustAmountOfMoneyOfWallet(walletIDNeedAdjustAmountOfMoney, changeAmount);
                } else {
                    await WalletController.adjustAmountOfMoneyOfWallet(walletIDNeedAdjustAmountOfMoney, -changeAmount);
                }
            }
            return deletedTransactions.affected;
        } catch (e) {
            return e.message;
        }
    }
    static async getAllTransactionByTimeRange(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            const userID: number = +req.token.userID;
            const { startDate, endDate } = req.query;
            let walletRole: WalletRole | undefined = await WalletRoleController.getWalletRole(walletID, userID);
            if (walletRole) {
                let transactionListIntime = await TransactionController.transactionRepository.find({
                    relations: {
                        category: true,
                        walletRole: {
                            user: true,
                            wallet: true
                        }
                    },
                    where: {
                        walletRole: {
                            wallet: {
                                id: walletID
                            }
                        },
                        date: Between(
                            new Date(parseDate(startDate)),
                            new Date(parseDate(endDate))
                        )
                    }
                });
                let transactionListBefore = await TransactionController.transactionRepository.find({
                    relations: {
                        category: true,
                        walletRole: {
                            user: true,
                            wallet: true
                        }
                    },
                    where: {
                        walletRole: {
                            wallet: {
                                id: walletID
                            }
                        },
                        date: LessThan(
                            new Date(parseDate(startDate))
                        )
                    }
                });
                res.status(200).json({
                    message: "Get transaction list success!",
                    transactionList: transactionListIntime,
                    transactionListBefore
                });
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

    static async searchAllTransactionByTimeRangeAndCategory(req: CustomRequest, res: Response) {
        try {
            const walletID: number = +req.params.walletID;
            const userID: number = +req.token.userID;
            console.log(req.query.categoryID);
            const { startDate, endDate } = req.query;
            let walletRole: WalletRole | undefined = await WalletRoleController.getWalletRole(walletID, userID);
            if (walletRole) {
                if (req.query.categoryID) {
                    let categoryID = +req.query.categoryID;
                    let transactionListIntime = await TransactionController.transactionRepository.find({
                        relations: {
                            category: true,
                            walletRole: {
                                user: true,
                                wallet: true
                            }
                        },
                        where: {
                            walletRole: {
                                wallet: {
                                    id: walletID
                                }
                            },
                            date: Between(
                                new Date(parseDate(startDate)),
                                new Date(parseDate(endDate))
                            ), category: {
                                id: +categoryID
                            }
                        }
                    });
                    res.status(200).json({
                        message: "Get transaction list success!",
                        transactionList: transactionListIntime,
                    });
                } else {
                    let transactionListIntime = await TransactionController.transactionRepository.find({
                        relations: {
                            category: true,
                            walletRole: {
                                user: true,
                                wallet: true
                            }
                        },
                        where: {
                            walletRole: {
                                wallet: {
                                    id: walletID
                                }
                            },
                            date: Between(
                                new Date(parseDate(startDate)),
                                new Date(parseDate(endDate))
                            )
                        }
                    });
                    res.status(200).json({
                        message: "Get transaction list success!",
                        transactionList: transactionListIntime,
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

}
function parseDate(input) {
    var parts = input.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]); // Tháng từ 0-11
}
export default TransactionController;

























