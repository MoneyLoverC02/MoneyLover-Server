import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {Wallet} from "../models/entity/Wallet";
import {Currency} from "../models/entity/Currency";
import {IconWallet} from "../models/entity/IconWallet";
import {WalletRole} from "../models/entity/WalletRole";
import {User} from "../models/entity/User";

class walletController {
    static userRepository = AppDataSource.getRepository(User);
    static walletRepository = AppDataSource.getRepository(Wallet);
    static currencyRepository = AppDataSource.getRepository(Currency);
    static iconWalletRepository = AppDataSource.getRepository(IconWallet);
    static walletRoleRepository = AppDataSource.getRepository(WalletRole);

    static async createWallet(req: Request, res: Response) {
        try {
            const {name, iconID, currencyID, amountOfMoney} = req.body;
            let wallet = await walletController.walletRepository.findOneBy({name});
            if (!wallet) {
                let currency = await walletController.currencyRepository.findOneBy({id: +currencyID});
                let iconWallet = await walletController.iconWalletRepository.findOneBy({id: +iconID});
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

    // static async getWallet(req: Request, res: Response) {
    //     try {
    //         let wallet = await walletController.walletRepository.findOneBy({id: +req.params.id});
    //         let wallet = await walletController.walletRepository.find({
    //             relations: {
    //                 icon: true,
    //                 currency: true,
    //                 walletRoles: true
    //             },
    //             where: {
    //                 walletRoles: {
    //                     wallet: walletID
    //                 }
    //             }
    //         });
    //         if (wallet) {
    //             res.status(200).json({
    //                 message: "Get wallet success!",
    //                 wallet: wallet
    //             });
    //         } else {
    //             res.status(200).json({
    //                 message: "Get wallet failed!",
    //             });
    //         }
    //     } catch (e) {
    //         res.status(500).json({
    //             message: e.message
    //         });
    //     }
    // }

    static async getWalletList(req: Request, res: Response) {
        try {
            let user = await walletController.userRepository.findOneBy({id: +req.body.userID})
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
            if (walletList) {
                res.status(200).json({
                    message: "Get walletList success",
                    walletList: walletList
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async updateWallet(req: Request, res: Response) {
        try {
            let id = +req.params.id;
            let updatedWallet = await walletController.walletRepository.findOneBy({id});
            if (updatedWallet) {
                const {name, iconID, currencyID, amountOfMoney} = req.body;
                updatedWallet.name = name;
                updatedWallet.amountOfMoney = +amountOfMoney;
                if (updatedWallet.currency.id !== currencyID) {
                    updatedWallet.currency = await walletController.currencyRepository.findOneBy({id: +currencyID});
                }
                if (updatedWallet.icon.id !== iconID) {
                    updatedWallet.icon = await walletController.iconWalletRepository.findOneBy({id: +iconID});
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
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default walletController;