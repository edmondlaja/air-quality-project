import { NextFunction, Request, Response } from "express";
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../common/api-response";
import { ExternalApiError } from "../errors/external-api-error";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, req: Request, res: Response, next: NextFunction) {
        console.error(error);

        if (error && error.errors) {
            this.handleValidationError(error, res);
        } else if (error instanceof ExternalApiError) {
            this.handleExternalApiError(error, res);
        } else if (error instanceof HttpError) {
            this.handleHttpError(error, res);
        } else {
            this.handleGenericError(res);
        }
    }

    private handleExternalApiError(error: ExternalApiError, res: Response) {
        apiResponse(res, error.statusCode, { message: error.message });
    }

    private handleHttpError(error: HttpError, res: Response) {
        apiResponse(res, error.httpCode, { message: error.message });
    }

    private handleValidationError(error: any, res: Response) {
        const errors = error.errors.map((err: any) => ({ property: err.property, constraints: err.constraints }));
        apiResponse(res, error.httpCode || StatusCodes.BAD_REQUEST, { message: error.message, errors });
    }

    private handleGenericError(res: Response) {
        apiResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: "Internal server error." });
    }
}
