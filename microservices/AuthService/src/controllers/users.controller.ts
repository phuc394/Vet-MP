import { Request, Response } from "express";

import usersService from "../services/users.service";

import {
  errorResponse,
  successResponse,
} from "../utils/response.util";

const parseUserId = (id: unknown) => {
  if (Array.isArray(id)) {
    throw new Error("Invalid user id");
  }

  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user id");
  }

  return userId;
};

const getAllUsers = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await usersService.getAllUsers();

    return successResponse(
      res,
      200,
      "Get all users successful",
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

const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = parseUserId(req.params.id);

    const result = await usersService.getUserById(
      userId
    );

    return successResponse(
      res,
      200,
      "Get user successful",
      result
    );
  } catch (error: any) {
    const statusCode =
      error.message === "Invalid user id" ? 400 : 404;

    return errorResponse(
      res,
      statusCode,
      error.message
    );
  }
};

const searchUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const keyword = String(req.query.q ?? "").trim();

    if (!keyword) {
      return errorResponse(
        res,
        400,
        "Search keyword is required"
      );
    }

    const result = await usersService.searchUsers(
      keyword
    );

    return successResponse(
      res,
      200,
      "Search users successful",
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

const deleteInactiveUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = parseUserId(req.params.id);

    const result =
      await usersService.deleteInactiveUser(userId);

    return successResponse(
      res,
      200,
      result.message
    );
  } catch (error: any) {
    const statusCode =
      error.message === "Invalid user id"
        ? 400
        : error.message ===
          "Only inactive users can be deleted"
          ? 400
          : error.message === "User not found"
            ? 404
            : 500;

    return errorResponse(
      res,
      statusCode,
      error.message
    );
  }
};

export default {
  getAllUsers,
  getUserById,
  searchUsers,
  deleteInactiveUser,
};
