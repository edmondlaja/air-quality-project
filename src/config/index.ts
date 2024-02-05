import "dotenv/config";
import { IConfig } from "./config.interface";

export const config: IConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};
