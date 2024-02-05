import AirQuality from "../models/db-schemas/AirQuality";

export class AirQualityRepository {
    async getWorstAirQuality(lon: number, lat: number) {
        return await AirQuality.findOne({ lat, lon }, "lat lon aqius timestamp -_id").sort({ aqi: -1 }).lean().exec();
    }
}
