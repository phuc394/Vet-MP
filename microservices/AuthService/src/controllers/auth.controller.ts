import { Request, Response } from "express";

import authService from "../services/auth.service";

import {
  successResponse,
  errorResponse,
} from "../utils/response.util";

import {
  validateRegister,
  validateLogin,
} from "../validators/auth.validator";

const register = async (
  req: Request,
  res: Response
) => {
  try {
    const error = validateRegister(req.body);

    if (error) {
      return errorResponse(res, 400, error);
    }

    const result =
      await authService.registerCustomer(
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

const login = async (
  req: Request,
  res: Response
) => {
  try {
    const error = validateLogin(req.body);

    if (error) {
      return errorResponse(res, 400, error);
    }

    const result =
      await authService.login(req.body);

    return successResponse(
      res,
      200,
      "Login successful",
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

const refreshToken = async (
  req: Request,
  res: Response
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(
        res,
        400,
        "Refresh token is required"
      );
    }

    const result =
      await authService.refreshAccessToken(
        refreshToken
      );

    return successResponse(
      res,
      200,
      "Refresh token successful",
      result
    );
  } catch (error: any) {
    return errorResponse(
      res,
      401,
      error.message
    );
  }
};
const forgotPassword = async (
  req : Request,
  res : Response
) => {
  try {
    const { email } = req.body;

    const result =
      await authService.forgotPassword(
        email
      );

    return res.status(200).json(result);
  } catch (error : any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const resetPassword = async (
  req : Request,
  res : Response
) => {
  try {
    const {
      token,
      newPassword,
    } = req.body;

    const result =
      await authService.resetPassword(
        token,
        newPassword
      );

    return res.status(200).json(result);
  } catch (error : any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
const logout = async (
  req: Request,
  res: Response
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(
        res,
        400,
        "Refresh token is required"
      );
    }

    const result =
      await authService.logout(
        refreshToken
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

const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const userId = (req as any).user.user_id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const result =
      await authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

    res.status(200).json(result);

  } catch (error: any) {

    res.status(400).json({
      message: error.message,
    });

  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword
};