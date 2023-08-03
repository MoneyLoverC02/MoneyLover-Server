import {Request, Response} from "express";
import {AppDataSource} from "../models/data-source";
import {Wallet} from "../models/entity/Wallet";
import {Currency} from "../models/entity/Currency";
import {IconWallet} from "../models/entity/IconWallet";

class walletController {
    static async createWallet(req: Request, res: Response) {
        try {
            const walletRepository = AppDataSource.getRepository(Wallet);
            const currencyRepository = AppDataSource.getRepository(Currency)
            const iconWalletRepository = AppDataSource.getRepository(IconWallet)
            const {name, iconID, currencyID, amountOfMoney} = req.body;
            let wallet = await walletRepository.findOneBy({name});
            if (!wallet) {
                let currency = await currencyRepository.findOneBy({id: +currencyID});
                let iconWallet = await iconWalletRepository.findOneBy({id: +iconID});
                if (currency && iconWallet) {
                    let newWallet = new Wallet();
                    newWallet.name = name;
                    newWallet.icon = iconWallet;
                    newWallet.currency = currency;
                    newWallet.amountOfMoney = +amountOfMoney;
                    let result = await walletRepository.save(newWallet);
                    if (result) {
                        res.status(200).json({
                            message: "Creat wallet success!",
                            newWallet: result
                        });
                    }
                }
            } else {
                res.status(500).json({
                    message: "Name of wallet already exist"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

    static async getWalletList(req: Request, res: Response) {
        try {
            const walletRepository = AppDataSource.getRepository(Wallet);
            let walletList = await walletRepository.find({relations: ['currency', 'icon']});
            if (walletList) {
                res.status(200).json({
                    message: "Success",
                    walletList: walletList
                });
            }
        } catch (e) {
            res.status(500).json({
                message: e.message
            });
        }
    }

}

export default walletController;