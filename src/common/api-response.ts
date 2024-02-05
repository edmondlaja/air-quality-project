import { Response } from "express";

export function apiResponse(res: Response, statusCode: number, jsonObject: object) {
    return res.status(statusCode).json(jsonObject);
}
