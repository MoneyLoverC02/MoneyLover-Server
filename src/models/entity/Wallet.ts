import {Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne} from "typeorm";
import {Currency} from "./Currency";
import {WalletDetail} from "./WalletDetail";
import {Icon} from "./Icon";

@Entity()

export class Wallet {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({type: 'varchar'})
    public name: string;

    @ManyToOne(() => Icon, icon => icon.wallet)
    public icon: Icon;

    @ManyToOne(() => Currency, currency => currency.wallet)
    public currency: Currency;

    @Column({type: 'int'})
    public amountOfMoney: number;

    @OneToMany(() => WalletDetail, walletDetails => walletDetails.wallet)
    walletDetails: WalletDetail[];

}