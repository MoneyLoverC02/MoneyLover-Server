import { Request, Response } from "express";
import { AppDataSource } from "../models/data-source";
import { User } from "../models/entity/User";
import { Wallet } from "../models/entity/Wallet";

class userController {
    static async createUser(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const { email, password } = req.body;
            let user = await userRepository.findOneBy({ email: email });
            if (!user) {
                let newUser = new User();
                newUser.email = email;
                newUser.password = password;
                let result = await userRepository.save(newUser);
                if (result) {
                    res.status(200).json({
                        message: "Creat user success!",
                        newUser: result
                    })
                }
            } else {
                res.status(200).json({
                    message: "Email already exist"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            })
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            let user = await userRepository.findOneBy(req.body);
            if (user) {
                res.status(200).json({
                    message: "Login success!",
                    user
                })
            } else {
                res.status(200).json({
                    message: "Email or password wrong"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            })
        }
    }

    static async getListUser(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find();
            if (users) {
                res.status(200).json({
                    message: "Get list users successfully",
                    listUser: users
                })
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }

    static async getWalletList(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const walletRepository = AppDataSource.getRepository(Wallet);
            let userID = +req.params.id;
            let user = await userRepository.findOneBy({ id: userID });
            if (user) {
                let walletList = await walletRepository.find({
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
}

export default userController;

