import "reflect-metadata";
import mongoose from "mongoose";
import express, { Express } from "express";
import { Server } from "http";
import { useExpressServer } from "routing-controllers";

import { config } from "./config";
import { CustomErrorHandler } from "./middleware/error-handler.middleware";
import { AirQualityController } from "./controllers/air-quality.controller";

export class App {
    private app: Express;
    private server: Server;

    constructor() {
        this.app = express();
    }

    initApp(): Server {
        useExpressServer(this.app, {
            controllers: [AirQualityController],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false,
            validation: true,
            defaults: {
                nullResultCode: 404,
                undefinedResultCode: 204,
                paramOptions: {
                    required: true,
                },
            },
        });

        this.server = this.app.listen(config.port, () => console.info(`Server started on port ${config.port}`));
        return this.server;
    }

    async initDB(dbConnectionString: string): Promise<void> {
        try {
            await mongoose.connect(dbConnectionString);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Could not connect to MongoDB", error);
            process.exit(1);
        }
    }

    async closeDB(): Promise<void> {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log("MongoDB connection closed");
        }
    }

    closeServer(): void {
        if (this.server) {
            this.server.close(() => {
                console.log("Server closed");
            });
        }
    }
}
