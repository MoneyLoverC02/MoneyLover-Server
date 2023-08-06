import {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import config from "../config/config";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const SECRET_KEY: Secret = config.jwtSecretKey;

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                    if (err) {
                        return res.status(401).json({
                            message: err.message
                        });
                    } else {
                        (req as CustomRequest).token = decoded;
                        next();
                    }
                },
            );
        } else {
            return res.status(401).json({
                message: 'No token provided!'
            });
        }
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

export default auth;

