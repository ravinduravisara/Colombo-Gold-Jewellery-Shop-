import { CustomerEnquiry, ICustomerEnquiry } from "./enquiry.model";
import { NotificationService } from "../../services/notification.service";
import { ApiError } from "../../utils/ApiError";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export class EnquiryService {
  static async submitEnquiry(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    const enquiry = await CustomerEnquiry.create(data);
    NotificationService.notifyNewEnquiry(data.name, data.subject).catch(() => {});
    return enquiry;
  }

  static async listAdminEnquiries(query: any) {
    const { page, limit, skip } = getPagination(query, 15);
    const filter: any = {};
    if (query.status) filter.status = query.status;

    const [total, enquiries] = await Promise.all([
      CustomerEnquiry.countDocuments(filter),
      CustomerEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return {
      enquiries,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async respondEnquiry(id: string, responseNotes: string) {
    const enquiry = await CustomerEnquiry.findByIdAndUpdate(
      id,
      { status: "responded", responseNotes },
      { new: true }
    );
    if (!enquiry) throw ApiError.notFound("Enquiry not found");
    return enquiry;
  }
}

