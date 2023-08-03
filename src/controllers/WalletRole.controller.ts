import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {WalletRole} from "../models/entity/WalletRole";
import {Wallet} from "../models/entity/Wallet";
import {User} from "../models/entity/User";


class WalletRoleController {
    static walletDetailRepository = AppDataSource.getRepository(WalletRole);

    static async createWalletRole(req: Request, res: Response) {

        try {
            const {userID, walletID} = req.body;
            let newWalletDetail = new WalletRole();
            newWalletDetail.user = userID;
            newWalletDetail.wallet = walletID;
            newWalletDetail.role = "owner";
            let result = await WalletRoleController.walletDetailRepository.save(newWalletDetail);
            if (result) {
                res.status(200).json({
                    message: "Creat walletDetail success!",
                    newWallet: result
                });
            }
        } catch (e) {
            res.status(500).json({
                message: "Name of wallet already exist"
            });
        }
    }
}