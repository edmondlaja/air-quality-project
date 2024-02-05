import mongoose from "mongoose";
import { App } from "../src/app";

const app = new App();
let server;

export async function startApp() {
    const mongoConnectionString = process.env.TEST_MONGO_CONNECTION_STRING;
    if (!mongoConnectionString) throw new Error("Mongodb connection string for tests is not set");

    await app.initDB(mongoConnectionString);
    server = app.initApp();
    return server;
}

export async function stopApp() {
    await app.closeDB();
    server.close();
}

export async function clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}
