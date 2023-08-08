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

    static async getWalletRoleListByUserID(userID: number) {
        try {
            return await WalletRoleController.walletRoleRepository.find({
                relations: {
                    wallet: {}
                },
                where: {
                    user: {
                        id: userID
                    }
                }
            });
        } catch (e) {
            return e.message;
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

    static async deleteWalletRolesByWalletID(walletID: number) {
        let deletedWalletRole = await WalletRoleController.walletRoleRepository.delete({
            wallet: {
                id: walletID
            }
        });
        return deletedWalletRole.affected;
    }

    static async deleteWalletRolesByUserID(userID: number) {
        let deletedWalletRole = await WalletRoleController.walletRoleRepository.delete({
            user: {
                id: userID
            }
        });
        return deletedWalletRole.affected;
    }

    static async getWalletRoleListHaveOwnerRoleByWalletID(walletID: number) {
        return await WalletRoleController.walletRoleRepository.find({
            where: {
                role: "owner",
                wallet: {
                    id: walletID
                }
            }
        });
    }

}

export default WalletRoleController;