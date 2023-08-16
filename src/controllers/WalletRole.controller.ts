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
            const walletID: number = +req.body.walletID;
            const userID: number = +req.token.userID;
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
                res.json({
                    message: "WalletRole already exist"
                });
            } else {
                let user = await WalletRoleController.userRoleRepository.findOneBy({id: userID});
                let wallet = await WalletRoleController.walletRepository.findOneBy({id: walletID});
                let newWalletRole = new WalletRole();
                newWalletRole.user = user;
                newWalletRole.wallet = wallet;
                if (req.body.role) {
                    newWalletRole.role = req.body.role;
                }
                if (req.body.archived) {
                    newWalletRole.archived = req.body.archived;
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

    static async getWalletRole(walletID: number, userID: number) {
        try {
            let walletRole = await WalletRoleController.walletRoleRepository.find({
                relations: {
                    user: true,
                    wallet: true
                },
                where: {
                    user: {
                        id: userID
                    },
                    wallet: {
                        id: walletID
                    }
                }
            });
            return walletRole[0];
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

    static async getWalletRoleListByWalletID(walletID: number) {
        try {
            return await WalletRoleController.walletRoleRepository.find({
                where: {
                    wallet: {
                        id: walletID
                    }
                }
            });
        } catch (e) {
            return e.message;
        }
    }

    static async archivedWalletRoleByWalletRoleID(walletRoleID: number) {
        try {
            let archivedWalletRole = await WalletRoleController.walletRoleRepository.findOneBy({
                id: walletRoleID
            });
            archivedWalletRole.archived = !archivedWalletRole.archived;
            return await WalletRoleController.walletRoleRepository.save(archivedWalletRole);
        } catch (e) {
            return e.message;
        }
    }

    static async getAllUsersOfTheWallet(walletID: number) {
        try {
            let WalletRoleList: WalletRole[] = await WalletRoleController.walletRoleRepository.find({
                relations: {
                    user: true
                },
                where: {
                    wallet: {
                        id: walletID
                    }
                }
            });
            type userOfTheWalletData = {
                email: string,
                role: string
            }
            let allUsersOfTheWallet: userOfTheWalletData[] = [];
            for (const walletRole of WalletRoleList) {
                allUsersOfTheWallet.push({email: walletRole.user.email, role: walletRole.role});
            }
            if (WalletRoleList.length) {
                return allUsersOfTheWallet;
            }
        } catch (e) {
            return e.message;
        }
    }

}

export default WalletRoleController;