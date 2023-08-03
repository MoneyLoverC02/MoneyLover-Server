import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {WalletRole} from "./WalletRole";

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({type: 'varchar'})
    public email: string;

    @Column({type: 'varchar'})
    public password: string;

    @OneToMany(() => WalletRole, walletDetails => walletDetails.user)
    walletDetails: WalletRole[];
}