import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {User} from "../models/entity/User";

class userController {
    static async createUser(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const {email, password} = req.body;
            let user = await userRepository.findOneBy({email: email});
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


}

export default userController;

