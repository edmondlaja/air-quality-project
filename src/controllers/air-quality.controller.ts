import { JsonController, Get, QueryParams } from "routing-controllers";
import { AirQualityService } from "../services/air-quality.service";
import { AirQualityDto } from "../models/dto/air-quality.dto";

@JsonController("/air-quality")
export class AirQualityController {
    constructor(private airQualityService: AirQualityService = new AirQualityService()) {}

    @Get("/")
    async getAirQuality(@QueryParams() params: AirQualityDto) {
        return this.airQualityService.getAirQuality(params.lon.toString(), params.lat.toString());
    }
}
