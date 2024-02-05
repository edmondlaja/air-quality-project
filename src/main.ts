import { App } from "./app";

const app = new App();

export const bootstrap = async () => {
    await app.initDB(process.env.MONGO_CONNECTION_STRING);
    app.initApp();
};

bootstrap();
