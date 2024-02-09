import { WorstAirQuality } from "../types/worst-air-quality.type";
import AirQuality from "../common/db-schemas/AirQuality";

export class AirQualityRepository {
    async getWorstAirQuality(lon: number, lat: number): Promise<WorstAirQuality> {
        return await AirQuality.findOne({ lat, lon }, "lat lon aqius timestamp -_id").sort({ aqius: -1 }).lean().exec();
    }

    async createAirQuality(lon: number, lat: number, aqius: number): Promise<void> {
        const newAirQuality = new AirQuality({ lon, lat, aqius });
        await newAirQuality.save();
    }
}
