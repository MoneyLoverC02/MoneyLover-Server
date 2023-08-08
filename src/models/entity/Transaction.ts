import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {Category} from "./Category";
import {Wallet} from "./Wallet";

@Entity()

export class Transaction {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @ManyToOne(() => Category, category => category.transaction)
    public category: Category;

    @Column({type: "int"})
    public amount: number;

    @Column({ type: 'date'})
    public date: Date;

    @Column({type: "varchar"})
    public note: string;

    @ManyToOne(() => Wallet, wallet => wallet.transaction)
    public wallet: Wallet;

}