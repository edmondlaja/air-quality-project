import { NextFunction, Request, Response } from "express";
import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../common/api-response";
import { ExternalApiError } from "../errors/external-api-error";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction) {
        if (error instanceof ExternalApiError) {
            return apiResponse(res, error.statusCode, {
                message: error.message,
            });
        }

        if (error && error.errors) {
            return apiResponse(res, error.httpCode, {
                message: error.message,
                errors: error.errors.map((err: any) => {
                    return { property: err.property, constraints: err.constraints };
                }),
            });
        }

        return apiResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
            message: "Internal server error.",
        });
    }
}
