import cron from "node-cron";
import { AirQualityService } from "../services/air-quality.service";
import AirQuality from "../models/db-schemas/AirQuality";
import { PARIS_LAT, PARIS_LON } from "../common/constants";

const airQualityService = new AirQualityService();

export const scheduleAirQualityChecks = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const { aqius } = await airQualityService.getAirQuality(PARIS_LON.toString(), PARIS_LAT.toString());

            const newRecord = new AirQuality({ lon: PARIS_LON, lat: PARIS_LAT, aqius });
            await newRecord.save();
            console.log("Air quality record saved:", newRecord);
        } catch (error) {
            console.error("Failed to fetch or save air quality data:", error);
        }
    });
};
