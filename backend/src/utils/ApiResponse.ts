export class ApiResponse<T = any> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data?: T;
  public meta?: Record<string, any>;

  constructor(statusCode: number, data?: T, message: string = "Success", meta?: Record<string, any>) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.meta = meta;
  }

  static success<T>(data: T, message: string = "Success", meta?: Record<string, any>) {
    return new ApiResponse(200, data, message, meta);
  }

  static created<T>(data: T, message: string = "Created successfully") {
    return new ApiResponse(201, data, message);
  }
}

