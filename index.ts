import express from "express";
import cors from 'cors'
import bodyParser from 'body-parser'
import {AppDataSource} from "./src/models/data-source";
import authRouter from "./src/routers/auth.router";
import userRouter from "./src/routers/User.router";
import walletRouter from "./src/routers/Wallet.router";
import currencyRouter from "./src/routers/Currency.router";
import iconWalletRouter from "./src/routers/IconWallet.router";
import walletRoleRouter from "./src/routers/WalletRole.router";

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', walletRouter);
app.use('/api', currencyRouter);
app.use('/api', iconWalletRouter);
app.use('/api', walletRoleRouter);

app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000");
});