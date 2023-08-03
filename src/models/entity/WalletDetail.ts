import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";
import {Wallet} from "./Wallet";

@Entity()

export class WalletDetail {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @ManyToOne(() => User, user => user.walletDetails)
    public user: User;

    @ManyToOne(() => Wallet, wallet => wallet.walletDetails)
    public wallet: Wallet;

    @Column({type: 'varchar'})
    public role: string;
}