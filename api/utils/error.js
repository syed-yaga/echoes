export function errorHandler(statusCode, message, p0) {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}
//# sourceMappingURL=error.js.map