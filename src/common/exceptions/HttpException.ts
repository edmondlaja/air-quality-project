import { HttpError } from "routing-controllers";

export class HttpException extends HttpError {
    public message: string;

    constructor(status: number, message: string) {
        super(status);
        this.message = message;
    }

    toJSON() {
        return {
            status: this.httpCode,
            message: this.message,
        };
    }
}
