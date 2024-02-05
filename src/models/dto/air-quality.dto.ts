import { IsNotEmpty, IsNumber, IsLatitude, IsLongitude } from "class-validator";

export class AirQualityDto {
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 6 })
    @IsLatitude()
    lat: number;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 6 })
    @IsLongitude()
    lon: number;
}
