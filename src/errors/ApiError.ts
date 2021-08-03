class ApiError extends Error {
    private constructor(public statusCode: number, public message: string) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(msg: string) {
        return new ApiError(400, msg);
    }

    static resourceNotFound(msg: string) {
        return new ApiError(404, msg);
    }

    static internal(msg: string) {
        return new ApiError(500, msg);
    }
}

export default ApiError;
