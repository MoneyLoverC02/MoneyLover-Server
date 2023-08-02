import {Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne} from "typeorm";
import {Currency} from "./Currency";
import {WalletDetail} from "./WalletDetail";

@Entity()

export class Wallet {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({type: 'varchar'})
    public name: string;

    @Column({type: 'varchar'})
    public icon: string;

    @ManyToOne(() => Currency, currency => currency.wallet)
    public currency: Currency;

    @Column({type: 'number'})
    public amountOfMoney: number;

    @OneToMany(() => WalletDetail, walletDetails => walletDetails.wallet)
    walletDetails: WalletDetail[];

}