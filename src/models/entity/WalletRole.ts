import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";
import {Wallet} from "./Wallet";

@Entity()

export class WalletRole {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @ManyToOne(() => User, user => user.walletRoles)
    public user: User;

    @ManyToOne(() => Wallet, wallet => wallet.walletRoles)
    public wallet: Wallet;

    @Column({default: "owner" , type: 'varchar'})
    public role: string;

    @Column({ default: false, type: 'boolean'})
    public archived: boolean;
}