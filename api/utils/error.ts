export function errorHandler(statusCode: Number, message: string, p0: number) {
  const error: any = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
}
