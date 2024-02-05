import { App } from "./app";
import { scheduleAirQualityChecks } from "./tasks/air-quality.task";

const app = new App();

export const bootstrap = async () => {
    const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
    if (!mongoConnectionString) throw new Error("Mongodb connection string is not set");

    await app.initDB(mongoConnectionString);
    scheduleAirQualityChecks();
    app.initApp();
};

bootstrap();
