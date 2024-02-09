import cron from "node-cron";
import { AirQualityService } from "../services/air-quality.service";
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
        await airQualityService.createAirQuality(PARIS_LON, PARIS_LAT, aqius);
    } catch (error) {
        console.error("Failed to fetch or save air quality data:", error);
    }
};
