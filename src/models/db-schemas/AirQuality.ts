import mongoose, { Document } from "mongoose";

interface IAirQuality extends Document {
    lat: number;
    lon: number;
    aqius: number;
    timestamp: Date;
}

const airQualitySchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    aqius: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const AirQuality = mongoose.model<IAirQuality>("AirQuality", airQualitySchema);
export default AirQuality;
