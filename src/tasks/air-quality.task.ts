import cron from "node-cron";
import { AirQualityService } from "../services/air-quality.service";
import AirQuality from "../common/db-schemas/AirQuality";
import { PARIS_LAT, PARIS_LON } from "../common/constants";

const airQualityService = new AirQualityService();

export const scheduleParisAirQualityChecks = () => {
    cron.schedule("* * * * *", async () => {
        await parisAirQualityCheck();
    });
};

export const parisAirQualityCheck = async () => {
    try {
        const { aqius } = await airQualityService.getAirQuality(PARIS_LON, PARIS_LAT);

        const newRecord = new AirQuality({ lon: PARIS_LON, lat: PARIS_LAT, aqius });
        await newRecord.save();
        console.log("Air quality record saved:", newRecord);
    } catch (error) {
        console.error("Failed to fetch or save air quality data:", error);
    }
};
