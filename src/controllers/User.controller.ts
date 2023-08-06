import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {User} from "../models/entity/User";
import config from "../config/config";
import {SECRET_KEY} from "../middlewares/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class userController {
    static userRepository = AppDataSource.getRepository(User);

    static async createUser(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            let user = await userController.userRepository.findOneBy({email});
            if (!user) {
                const passwordHash = await bcrypt.hash(password, config.bcryptSalt);
                let newUser = new User();
                newUser.email = email;
                newUser.password = passwordHash;
                let result = await userController.userRepository.save(newUser);
                if (result) {
                    res.status(200).json({
                        message: "Creat user success!",
                        newUser: result
                    });
                }
            } else {
                res.status(500).json({
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
            const user = await userController.userRepository.findOneBy({email});
            if (user) {
                const comparePass: boolean = await bcrypt.compare(password, user.password);
                if (!comparePass) {
                    res.status(401).json({
                        message: "Password not valid!",
                    })
                }
                let payload = {
                    userID: user.id,
                    email: user.email
                }
                const token = jwt.sign(payload, SECRET_KEY, {
                    expiresIn: 3600
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

    static async getListUser(req: Request, res: Response) {
        try {
            const users = await userController.userRepository.find();
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

    static async getUser(req: Request, res: Response) {
        try {
            const user = await userController.userRepository.findOneBy({id: +req.params.id});
            if (user) {
                res.status(200).json({
                    message: "Get user successfully",
                    user: user
                });
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }

}

export default userController;

