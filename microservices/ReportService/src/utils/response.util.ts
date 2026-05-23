import { Response } from "express";

export interface SuccessResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export const sendSuccess = <T>(
  res: Response,
  status: number,
  message: string,
  data: T
): Response<SuccessResponse<T>> => {
  return res.status(status).json({ status, message, data });
};

export const sendError = (res: Response, status: number, message: string): Response<ErrorResponse> => {
  return res.status(status).json({ status, message });
};
