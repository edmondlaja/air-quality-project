import { JsonController, Get, QueryParams } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { AirQualityService } from "../services/air-quality.service";
import { AirQualityDto } from "../dto/air-quality.dto";
import { PARIS_LAT, PARIS_LON } from "../common/constants";
import { HttpException } from "../common/exceptions/HttpException";
import { NotFoundError } from "../errors/not-found-error";
import { ExternalApiError } from "../errors/external-api-error";

@JsonController("/air-quality")
export class AirQualityController {
    private airQualityService: AirQualityService;

    constructor() {
        this.airQualityService = new AirQualityService();
    }

    @Get("/")
    async getAirQuality(@QueryParams() params: AirQualityDto) {
        try {
            return await this.airQualityService.getAirQuality(params.lon, params.lat);
        } catch (error) {
            if (error instanceof ExternalApiError) throw new HttpException(error.statusCode, error.message);
            throw error;
        }
    }

    @Get("/paris-worst")
    async getParisWorstAirQuality() {
        try {
            return await this.airQualityService.getWorstAirQuality(PARIS_LON, PARIS_LAT);
        } catch (error) {
            if (error instanceof NotFoundError) throw new HttpException(StatusCodes.NOT_FOUND, error.message);
            throw error;
        }
    }
}
