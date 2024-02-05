import { App } from "./app";
import { scheduleAirQualityChecks } from "./tasks/air-quality.task";

const app = new App();

export const bootstrap = async () => {
    await app.initDB(process.env.MONGO_CONNECTION_STRING);
    scheduleAirQualityChecks();
    app.initApp();
};

bootstrap();
