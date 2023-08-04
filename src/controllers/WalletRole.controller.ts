import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {WalletRole} from "../models/entity/WalletRole";
import {Wallet} from "../models/entity/Wallet";
import {User} from "../models/entity/User";
import walletController from "./Wallet.controller";


class WalletRoleController {
    static walletRoleRepository = AppDataSource.getRepository(WalletRole);

    static async createWalletRole(req: Request, res: Response) {
        try {
            const {userID, walletID} = req.body;
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
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getAll(req:Request, res:Response){
        let result = await WalletRoleController.walletRoleRepository.find()
        res.json(result)
    }
}

export default WalletRoleController;