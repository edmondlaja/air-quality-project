import { request } from "undici";
import { StatusCodes } from "http-status-codes";
import { IQAirApiResponse, PollutionData } from "../types/iqair-response.type";
import { ExternalApiError } from "../errors/external-api-error";
import { NotFoundError } from "../errors/not-found-error";
import { AirQualityRepository } from "../repositories/air-quality.repository";
import { WorstAirQuality } from "../types/worst-air-quality.type";

export class AirQualityService {
    private readonly apiKey: string;

    private airQualityRepository: AirQualityRepository;

    constructor() {
        if (!process.env.IQAIR_API_KEY) {
            throw new Error("API key for IQAir is not set");
        }
        this.apiKey = process.env.IQAIR_API_KEY;
        this.airQualityRepository = new AirQualityRepository();
    }

    async getAirQuality(longitude: number, latitude: number): Promise<PollutionData> {
        const url = `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.apiKey}`;
        const response = await request(url);
        const responseBody = (await response.body.json()) as IQAirApiResponse;

        if (responseBody.status === "success" && responseBody.data?.current?.pollution) {
            return responseBody.data.current.pollution;
        } else if (responseBody.status === "fail" || responseBody.status === "error") {
            throw new ExternalApiError(response.statusCode, responseBody.data.message);
        } else {
            throw new ExternalApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected response format from IQAir API");
        }
    }

    async getWorstAirQuality(longitude: number, latitude: number): Promise<WorstAirQuality> {
        const worstRecord = await this.airQualityRepository.getWorstAirQuality(longitude, latitude);
        if (!worstRecord) throw new NotFoundError("No air quality records found.");
        return worstRecord;
    }
}
