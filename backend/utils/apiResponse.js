export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendSuccess = (res, statusCode = 200, data = {}, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

export const sendPaginated = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

export default ApiError;
