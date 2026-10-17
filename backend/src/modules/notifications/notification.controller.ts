import { Request, Response } from "express";
import { Notification } from "./notification.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(30);
  const unreadCount = await Notification.countDocuments({ isRead: false });
  res.status(200).json(ApiResponse.success({ notifications, unreadCount }, "Notifications retrieved"));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.status(200).json(ApiResponse.success(null, "Notification marked as read"));
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.status(200).json(ApiResponse.success(null, "All notifications marked as read"));
});

