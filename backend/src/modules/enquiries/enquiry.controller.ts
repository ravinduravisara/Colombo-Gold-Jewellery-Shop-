import { Request, Response } from "express";
import { EnquiryService } from "./enquiry.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const submitEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await EnquiryService.submitEnquiry(req.body);
  res.status(201).json(
    ApiResponse.created(enquiry, "Thank you for reaching out! Our team will contact you shortly.")
  );
});

export const listAdminEnquiries = asyncHandler(async (req: Request, res: Response) => {
  const result = await EnquiryService.listAdminEnquiries(req.query);
  res.status(200).json(ApiResponse.success(result.enquiries, "Enquiries retrieved", result.meta));
});

export const respondEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await EnquiryService.respondEnquiry(req.params.id, req.body.responseNotes);
  res.status(200).json(ApiResponse.success(enquiry, "Enquiry marked as responded"));
});

