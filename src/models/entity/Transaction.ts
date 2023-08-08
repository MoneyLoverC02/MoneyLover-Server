import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {Wallet} from "./Wallet";

@Entity()

export class Transaction {
    @PrimaryGeneratedColumn()
    public readonly id: number;

}