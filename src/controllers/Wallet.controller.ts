import {Response} from "express";
import {CustomRequest} from "../middlewares/auth";
import {AppDataSource} from "../models/data-source";
import {Wallet} from "../models/entity/Wallet";
import {Currency} from "../models/entity/Currency";
import {IconWallet} from "../models/entity/IconWallet";
import {WalletRole} from "../models/entity/WalletRole";
import {User} from "../models/entity/User";
import WalletRoleController from "./WalletRole.controller";

class walletController {
    static userRepository = AppDataSource.getRepository(User);
    static walletRepository = AppDataSource.getRepository(Wallet);
    static currencyRepository = AppDataSource.getRepository(Currency);
    static iconWalletRepository = AppDataSource.getRepository(IconWallet);
    static walletRoleRepository = AppDataSource.getRepository(WalletRole);

    static async createWallet(req: CustomRequest, res: Response) {
        try {
            const { name, iconID, currencyID, amountOfMoney } = req.body;
            let wallet = await walletController.walletRepository.findOneBy({ name });
            if (!wallet) {
                let currency = await walletController.currencyRepository.findOneBy({ id: +currencyID });
                let iconWallet = await walletController.iconWalletRepository.findOneBy({ id: +iconID });
                if (currency && iconWallet) {
                    let newWallet = new Wallet();
                    newWallet.name = name;
                    newWallet.icon = iconWallet;
                    newWallet.currency = currency;
                    newWallet.amountOfMoney = +amountOfMoney;
                    let result = await walletController.walletRepository.save(newWallet);
                    if (result) {
                        res.status(200).json({
                            message: "Creat wallet success!",
                            newWallet: result
                        });
                    }
                }
            } else {
                res.status(500).json({
                    message: "Name of wallet already exist"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getWallet(req: CustomRequest, res: Response) {
        try {
            let walletID: number = +req.params.walletID;
            let userID: number = +req.params.userID;
            let user = await walletController.userRepository.findOneBy({id: userID})
            if (user) {
                let wallet = await walletController.walletRepository.find({
                    relations: {
                        icon: true,
                        currency: true,
                        walletRoles: true
                    },
                    where: {
                        id: walletID,
                        walletRoles: {
                            user: user
                        }
                    }
                });
                if (wallet.length) {
                    res.status(200).json({
                        message: "Get wallet success!",
                        wallet: wallet[0]
                    });
                } else {
                    res.status(200).json({
                        message: "No data!",
                    });
                }
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

    static async getWalletList(req: CustomRequest, res: Response) {
        try {
            let userID: number = +req.params.userID;
            let user = await walletController.userRepository.findOneBy({id: userID});
            if (user) {
                let walletList = await walletController.walletRepository.find({
                    relations: {
                        icon: true,
                        currency: true,
                        walletRoles: true
                    },
                    where: {
                        walletRoles: {
                            user: user
                        }
                    }
                });
                if (walletList.length) {
                    res.status(200).json({
                        message: "Get walletList success",
                        walletList: walletList
                    });
                } else {
                    res.status(200).json({
                        message: "No data!",
                        walletList: walletList
                    });
                }
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

    static async updateWallet(req: CustomRequest, res: Response) {
        try {
            let walletID: number = +req.params.walletID;
            let userID: number = +req.params.userID;
            let walletRole = await WalletRoleController.getRole(walletID, userID);
            if (walletRole === 'owner') {
                const updatedWallet = await walletController.walletRepository.find({
                    relations: {
                        icon: true,
                        currency: true
                    },
                    where: {
                        id: walletID
                    }
                });
                const {name, iconID, currencyID, amountOfMoney} = req.body;
                updatedWallet[0].name = name;
                updatedWallet[0].amountOfMoney = +amountOfMoney;
                if (updatedWallet[0].currency.id !== +currencyID) {
                    updatedWallet[0].currency = await walletController.currencyRepository.findOneBy({id: +currencyID});
                }
                if (updatedWallet[0].icon.id !== +iconID) {
                    updatedWallet[0].icon = await walletController.iconWalletRepository.findOneBy({id: +iconID});
                }
                let result = await walletController.walletRepository.save(updatedWallet);
                if (result) {
                    res.status(200).json({
                        message: "Update wallet success!",
                        updatedWallet: result
                    });
                } else {
                    res.status(500).json({
                        message: "Update wallet failed!",
                    });
                }
            } else {
                res.status(500).json({
                    message: "No permission to update!",
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async deleteWallet(req: CustomRequest, res: Response) {
        try {
            let walletID: number = +req.params.walletID;
            let userID: number = +req.params.userID;
            let role = await WalletRoleController.getRole(walletID, userID);
            if (role === 'owner') {
                const resultDeletedWalletRole: number = await WalletRoleController.deleteWalletRoles(walletID);
                if (resultDeletedWalletRole) {
                    const deletedWallet = await walletController.walletRepository.delete({id: walletID});
                    if (deletedWallet.affected) {
                        res.status(200).json({
                            message: "Delete wallet success!",
                        });
                    }
                }
            } else {
                res.status(500).json({
                    message: "No permission to delete!",
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default walletController;