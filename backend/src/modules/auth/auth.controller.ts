import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { setAuthCookies, clearAuthCookies } from "../../utils/generateToken";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(201).json(
    ApiResponse.created(
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      "Account registered successfully"
    )
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(200).json(
    ApiResponse.success(
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      "Logged in successfully"
    )
  );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await AuthService.refreshToken(token);
  setAuthCookies(res, result.accessToken, result.refreshToken);

  res.status(200).json(
    ApiResponse.success(
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      "Token refreshed successfully"
    )
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.logout(req.user?.userId);
  clearAuthCookies(res);

  res.status(200).json(ApiResponse.success(null, "Logged out successfully"));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await AuthService.forgotPassword(email, req.headers.origin as string);

  res.status(200).json(
    ApiResponse.success(
      null,
      "If that email exists in our records, a password reset link has been dispatched."
    )
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await AuthService.resetPassword(token, newPassword);

  res.status(200).json(ApiResponse.success(null, "Password reset successfully. You may now login."));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.getMe(req.user!.userId);
  res.status(200).json(ApiResponse.success(user, "User profile retrieved"));
});

