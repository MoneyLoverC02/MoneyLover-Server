import {Request, Response} from "express";
import {CustomRequest} from "../middlewares/auth";
import {AppDataSource} from "../models/data-source";
import {User} from "../models/entity/User";
import WalletRoleController from "./WalletRole.controller";
import WalletController from "./Wallet.controller";
import config from "../config/config";
import {SECRET_KEY} from "../middlewares/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {WalletRole} from "../models/entity/WalletRole";

export interface TokenPayload {
    userID: number;
    email: string;
}

class UserController {
    static userRepository = AppDataSource.getRepository(User);

    static async createUser(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            let user = await UserController.userRepository.findOneBy({email});
            if (!user) {
                const passwordHash = await bcrypt.hash(password, config.bcryptSalt);
                let newUser = new User();
                newUser.email = email;
                newUser.password = passwordHash;
                let result = await UserController.userRepository.save(newUser);
                if (result) {
                    res.status(200).json({
                        message: "Creat user success!",
                        newUser: result
                    });
                }
            } else {
                res.status(200).json({
                    message: "Email already exist"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            const user = await UserController.userRepository.findOneBy({email});
            if (user) {
                const comparePass: boolean = await bcrypt.compare(password, user.password);
                if (!comparePass) {
                    return res.status(401).json({
                        message: "Password not valid!",
                    })
                }
                let payload: TokenPayload = {
                    userID: user.id,
                    email: user.email
                }
                const token = jwt.sign(payload, SECRET_KEY, {
                    expiresIn: 36000
                });
                res.status(200).json({
                    message: "Login success!",
                    user: user,
                    token: token
                });
            } else {
                res.status(401).json({
                    message: "Email not valid!"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getListUser(req: CustomRequest, res: Response) {
        try {
            const users = await UserController.userRepository.find();
            if (users) {
                res.status(200).json({
                    message: "Get list users successfully",
                    listUser: users
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }

    static async deleteUser(req: CustomRequest, res: Response) {
        try {
            const userID: number = +req.params.userID;
            const walletRoleList: WalletRole[] | [] = await WalletRoleController.getWalletRoleListByUserID(userID);
            if (!walletRoleList.length) {
                await UserController.userRepository.delete(userID);
                res.status(200).json({
                    message: "Delete user success!",
                    numberOfWalletsDeleted: 0
                });
            } else {
                await WalletRoleController.deleteWalletRolesByUserID(userID);
                // get the walletIDs that have the role of "owner" and belong to the user to be deleted
                let walletIDsHaveOwnerRole: number[] = [];
                for (const walletRole of walletRoleList) {
                    if (walletRole.role === "owner") {
                        walletIDsHaveOwnerRole.push(walletRole.wallet.id);
                    }
                }
                // get the walletIDs that have the role of "owner" and belongs only to the user that needs to be deleted
                let walletIDsNeedDelete: number[] = [];
                for (const walletID of walletIDsHaveOwnerRole) {
                    let result = await WalletRoleController.getWalletRoleListHaveOwnerRoleByWalletID(walletID);
                    if (!result.length) {
                        walletIDsNeedDelete.push(walletID);
                    }
                }
                // delete the wallets in wallet_role table belonging to the user that needs to be deleted
                for (const walletIDNeedDelete of walletIDsNeedDelete) {
                    await WalletRoleController.deleteWalletRolesByWalletID(walletIDNeedDelete);
                }
                // delete the wallets in wallet table belonging to the user that needs to be deleted
                for (const walletIDNeedDelete of walletIDsNeedDelete) {
                    await WalletController.deleteWalletByWalletID(walletIDNeedDelete);
                }
                // delete the user in user table that needs to be deleted
                await UserController.userRepository.delete(userID);
                res.status(200).json({
                    message: "Delete user success!",
                    numberOfWalletsDeleted: walletIDsNeedDelete.length
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async updateUser(req: CustomRequest, res: Response) {
        try {
            const {email, password} = req.body;
            const passwordHash = await bcrypt.hash(password, config.bcryptSalt);
            const updatedUser = await UserController.userRepository.findOneBy({id: +req.params.userID});
            updatedUser.email = email;
            updatedUser.password = passwordHash;
            let result = await UserController.userRepository.save(updatedUser);
            if (result) {
                res.status(200).json({
                    message: "Update user success!",
                    updatedUser: result
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default UserController;

