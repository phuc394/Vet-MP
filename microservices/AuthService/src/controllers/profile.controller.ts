import {
  Response,
} from "express";

import profileService from "../services/profile.service";

import {
  successResponse,
  errorResponse,
} from "../utils/response.util";

import { AuthRequest } from "../middleware/identity.middleware";
import profileValidator from "../validators/profile.validator";

const getMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId =
      req.user!.user_id;

    const result =
      await profileService.getMyProfile(
        userId
      );

    return successResponse(
      res,
      200,
      "Get profile successful",
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

const updateMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const error =
      profileValidator.validateUpdateProfile(
        req.body
      );

    if (error) {
      return errorResponse(
        res,
        400,
        error
      );
    }

    const userId =
      req.user!.user_id;

    const result =
      await profileService.updateMyProfile(
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

export default {
  getMyProfile,
  updateMyProfile,
};
