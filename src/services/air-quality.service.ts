import { request } from "undici";
import { IQAirApiResponse, PollutionData } from "../types/iqair-response.type";
import { ExternalApiError } from "../errors/external-api-error";

export class AirQualityService {
    private readonly apiKey: string;

    constructor() {
        if (!process.env.IQAIR_API_KEY) {
            throw new Error("API key for IQAir is not set");
        }
        this.apiKey = process.env.IQAIR_API_KEY;
    }

    async getAirQuality(longitude: string, latitude: string): Promise<PollutionData> {
        const url = `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${this.apiKey}`;
        const response = await request(url);
        const responseBody = (await response.body.json()) as IQAirApiResponse;

        if (responseBody.status === "success" && responseBody.data?.current?.pollution) {
            return responseBody.data.current.pollution;
        } else if (responseBody.status === "fail" || responseBody.status === "error") {
            throw new ExternalApiError(response.statusCode, responseBody.data.message);
        } else {
            throw new ExternalApiError(500, "Unexpected response format from IQAir API");
        }
    }
}
