import { Request, Response } from "express";

import staffService from "../services/staff.service";

import staffValidator from "../validators/staff.validator";

import {
  successResponse,
  errorResponse,
} from "../utils/response.util";

const createStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const error =
      staffValidator.validateCreateStaff(
        req.body
      );

    if (error) {
      return errorResponse(
        res,
        400,
        error
      );
    }

    const result =
      await staffService.createStaff(
        req.body
      );

    return successResponse(
      res,
      201,
      result.message
    );
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

const getAllStaff = async (
  _req: Request,
  res: Response
) => {
  try {
    const result =
      await staffService.getAllStaff();

    return successResponse(
      res,
      200,
      "Get all staff successful",
      result
    );
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

const getStaffById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.id);

    const result =
      await staffService.getStaffById(
        userId
      );

    return successResponse(
      res,
      200,
      "Get staff successful",
      result
    );
  } catch (error: any) {
    return errorResponse(
      res,
      404,
      error.message
    );
  }
};

const updateStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const error =
      staffValidator.validateUpdateStaff(
        req.body
      );

    if (error) {
      return errorResponse(
        res,
        400,
        error
      );
    }

    const userId = Number(req.params.id);

    const result =
      await staffService.updateStaff(
        userId,
        req.body
      );

    return successResponse(
      res,
      200,
      result.message
    );
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

const deactivateStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.id);

    const result =
      await staffService.deactivateStaff(
        userId
      );

    return successResponse(
      res,
      200,
      result.message
    );
  } catch (error: any) {
    return errorResponse(
      res,
      500,
      error.message
    );
  }
};

export default {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deactivateStaff,
};