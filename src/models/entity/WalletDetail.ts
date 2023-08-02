import {Entity, Column, ManyToOne} from "typeorm";
import {User} from "./User";
import {Wallet} from "./Wallet";

@Entity()

export class WalletDetail {
    @ManyToOne(() => User, user => user.walletDetails)
    public user: User;

    @ManyToOne(() => Wallet, wallet => wallet.walletDetails)
    public wallet: Wallet;

    @Column({type: 'varchar'})
    public role: string;
}