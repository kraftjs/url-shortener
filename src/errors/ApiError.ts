class ApiError {
    constructor(public code: number, public message: string) {
        this.code = code;
        this.message = message;
    }

    static badRequest(msg: string) {
        return new ApiError(400, msg);
    }

    static resourceNotFound(msg: string) {
        return new ApiError(404, msg);
    }

    static conflict(msg: string) {
        return new ApiError(409, msg);
    }

    static internal(msg: string) {
        return new ApiError(500, msg);
    }
}

export default ApiError