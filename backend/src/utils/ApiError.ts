export class ApiError extends Error {
  public statusCode: number;
  public errors: any[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(msg: string, errors: any[] = []) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg: string = "Unauthorized access") {
    return new ApiError(401, msg);
  }

  static forbidden(msg: string = "Forbidden access") {
    return new ApiError(403, msg);
  }

  static notFound(msg: string = "Resource not found") {
    return new ApiError(404, msg);
  }

  static conflict(msg: string) {
    return new ApiError(409, msg);
  }

  static internal(msg: string = "Internal server error") {
    return new ApiError(500, msg);
  }
}

