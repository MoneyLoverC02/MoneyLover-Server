import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "S300pmu1",
    database: "moneyLover",
    synchronize: false,
    logging: false,
    entities: ["dist/src/models/entity/*.js"],
    // migrations: ["dist/src/migrations/*.js"],
})