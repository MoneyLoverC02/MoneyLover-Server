import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {User} from "../models/entity/User";

class userController {
    static userRepository = AppDataSource.getRepository(User);

    static async createUser(req: Request, res: Response) {
        try {
            const {email, password} = req.body;
            let user = await userController.userRepository.findOneBy({email: email});
            if (!user) {
                let newUser = new User();
                newUser.email = email;
                newUser.password = password;
                let result = await userController.userRepository.save(newUser);
                if (result) {
                    res.status(200).json({
                        message: "Creat user success!",
                        newUser: result
                    })
                }
            } else {
                res.status(500).json({
                    message: "Email already exist"
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
            const users = await userController.userRepository.find();
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

    static async getUser(req: Request, res: Response) {
        try {
            const user = await userController.userRepository.findOneBy({id: +req.params.id});
            if (user) {
                res.status(200).json({
                    message: "Get user successfully",
                    user: user
                })
            }
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
}
// @ts-ignore
export default userController;
