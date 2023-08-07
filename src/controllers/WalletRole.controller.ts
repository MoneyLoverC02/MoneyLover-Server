import {Response} from "express";
import {CustomRequest} from "../middlewares/auth";
import {AppDataSource} from "../models/data-source";
import {WalletRole} from "../models/entity/WalletRole";
import {Wallet} from "../models/entity/Wallet";
import {User} from "../models/entity/User";

class WalletRoleController {
    static walletRoleRepository = AppDataSource.getRepository(WalletRole);
    static walletRepository = AppDataSource.getRepository(Wallet);
    static userRoleRepository = AppDataSource.getRepository(User);

    static async createWalletRole(req: CustomRequest, res: Response) {
        try {
            const {userID, walletID} = req.body;
            let walletRole = await WalletRoleController.walletRoleRepository.find({
                where: {
                    user: {
                        id: userID
                    },
                    wallet: {
                        id: walletID
                    }
                }
            });
            if (walletRole.length) {
                res.status(401).json({
                    message: "WalletRole already exist"
                });
            } else {
                let newWalletRole = new WalletRole();
                newWalletRole.user = userID;
                newWalletRole.wallet = walletID;
                if (!req.body.role) {
                    newWalletRole.role = "owner";
                } else {
                    newWalletRole.role = req.body.role;
                }
                let result = await WalletRoleController.walletRoleRepository.save(newWalletRole);
                if (result) {
                    res.status(200).json({
                        message: "Creat walletRole success!",
                        newWallet: result
                    });
                }
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getWalletRoleList(req: CustomRequest, res: Response) {
        try {
            let userID: number = +req.params.userID;
            let walletRoleList = await WalletRoleController.walletRoleRepository.find({
                relations: {
                    wallet: {
                        icon: true,
                        currency: true
                    }
                },
                where: {
                    user: {
                        id: userID
                    }
                }
            });
            if (walletRoleList.length) {
                res.status(200).json({
                    message: "Get walletRoleList success!",
                    walletRoleList: walletRoleList
                });
            } else {
                res.status(200).json({
                    message: "No data!",
                    walletRoleList: walletRoleList
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getRole(walletID: number, userID: number) {
        try {
            let walletRole = await WalletRoleController.walletRoleRepository.find({
                where: {
                    user: {
                        id: userID
                    },
                    wallet: {
                        id: walletID
                    }
                }
            });
            if (walletRole.length) {
                return walletRole[0].role;
            } else {
                return "No data";
            }
        } catch (e) {
            return e.message;
        }
    }

    static async deleteWalletRoles(walletID: number) {
        let deletedWalletRole = await WalletRoleController.walletRoleRepository.delete({
            wallet: {
                id: walletID
            }
        });
        return deletedWalletRole.affected;
    }

}

export default WalletRoleController;