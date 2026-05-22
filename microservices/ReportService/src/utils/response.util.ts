import { Response } from "express";

export interface ErrorResponse {
  status: number;
  message: string;
}

export const sendError = (res: Response, status: number, message: string): Response<ErrorResponse> => {
  return res.status(status).json({ status, message });
};
