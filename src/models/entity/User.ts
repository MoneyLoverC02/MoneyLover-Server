import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {WalletDetail} from "./WalletDetail";

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({type: 'varchar'})
    public email: string;

    @Column({type: 'varchar'})
    public password: string;

    @OneToMany(() => WalletDetail, walletDetails => walletDetails.user)
    walletDetails: WalletDetail[];
}