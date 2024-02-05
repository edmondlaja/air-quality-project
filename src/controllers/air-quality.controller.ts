import { JsonController, Get, QueryParams } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { AirQualityService } from "../services/air-quality.service";
import { AirQualityDto } from "../models/dto/air-quality.dto";
import { AirQualityRepository } from "../repositories/air-quality.repository";
import { PARIS_LAT, PARIS_LON } from "../common/constants";
import { HttpException } from "../common/exceptions/HttpException";

@JsonController("/air-quality")
export class AirQualityController {
    private airQualityService: AirQualityService;
    private airQualityRepository: AirQualityRepository;

    constructor() {
        this.airQualityService = new AirQualityService();
        this.airQualityRepository = new AirQualityRepository();
    }

    @Get("/")
    async getAirQuality(@QueryParams() params: AirQualityDto) {
        return this.airQualityService.getAirQuality(params.lon.toString(), params.lat.toString());
    }

    @Get("/paris-worst")
    async getParisWorstAirQuality() {
        const worstRecord = await this.airQualityRepository.getWorstAirQuality(PARIS_LON, PARIS_LAT);
        if (!worstRecord) throw new HttpException(StatusCodes.NOT_FOUND, "No air quality records found.");
        return worstRecord;
    }
}
