import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Transaction} from "./Transaction";

@Entity()

export class Category {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({type: "varchar"})
    public type: string;

    @Column({type: "varchar"})
    public icon: string;

    @Column({type: "varchar"})
    public name: string;

    @OneToMany(() => Transaction, transaction => transaction.category)
    public transaction: Transaction[];
}