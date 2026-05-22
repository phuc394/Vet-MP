import { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/error.util";
import { sendError } from "../utils/response.util";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : "Internal server error";
  return sendError(res, status, message);
};
