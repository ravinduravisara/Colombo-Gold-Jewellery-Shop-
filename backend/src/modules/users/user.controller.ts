import { Request, Response } from "express";
import { UserService } from "./user.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const updated = await UserService.updateProfile(req.user!.userId, req.body);
  res.status(200).json(ApiResponse.success(updated, "Profile updated successfully"));
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await UserService.addAddress(req.user!.userId, req.body);
  res.status(201).json(ApiResponse.created(addresses, "Address added successfully"));
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await UserService.updateAddress(req.user!.userId, req.params.id, req.body);
  res.status(200).json(ApiResponse.success(addresses, "Address updated successfully"));
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await UserService.deleteAddress(req.user!.userId, req.params.id);
  res.status(200).json(ApiResponse.success(addresses, "Address deleted successfully"));
});

// Admin Controllers
export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const result = await UserService.listCustomers(req.query);
  res.status(200).json(ApiResponse.success(result.customers, "Customers retrieved", result.meta));
});

export const listAdminUsers = asyncHandler(async (req: Request, res: Response) => {
  const admins = await UserService.listAdminUsers();
  res.status(200).json(ApiResponse.success(admins, "Admin users retrieved"));
});

export const createStaffUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.createStaffUser(req.body);
  res.status(201).json(ApiResponse.created(user, "Staff member created successfully"));
});

export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.toggleUserStatus(req.params.id);
  res.status(200).json(ApiResponse.success(user, `User ${user.isActive ? "activated" : "deactivated"} successfully`));
});

