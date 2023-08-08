import {Response} from "express";
import {CustomRequest} from "../middlewares/auth";
import {AppDataSource} from "../models/data-source";
import {Wallet} from "../models/entity/Wallet";
import {Category} from "../models/entity/Category";
import {WalletRole} from "../models/entity/WalletRole";
import {User} from "../models/entity/User";

class TransactionController {
    static userRepository = AppDataSource.getRepository(User);
    static walletRepository = AppDataSource.getRepository(Wallet);
    static categoryRoleRepository = AppDataSource.getRepository(Category);
    static walletRoleRepository = AppDataSource.getRepository(WalletRole);

    static async addTransaction(req: CustomRequest, res: Response) {
        try {

        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default TransactionController;