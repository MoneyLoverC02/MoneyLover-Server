import express, {Request, Response} from "express";
import {AppDataSource} from "./src/models/data-source";

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });

const app = express();

app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000");
});