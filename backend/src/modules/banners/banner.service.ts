import { Banner, IBanner } from "./banner.model";
import { ApiError } from "../../utils/ApiError";

export class BannerService {
  static async getActive(position?: string) {
    const filter: any = { isActive: true };
    if (position) filter.position = position;
    return Banner.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  }

  static async listAdminAll() {
    return Banner.find().sort({ displayOrder: 1, createdAt: -1 });
  }

  static async create(data: Partial<IBanner>) {
    return Banner.create(data);
  }

  static async update(id: string, data: Partial<IBanner>) {
    const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
    if (!banner) throw ApiError.notFound("Banner not found");
    return banner;
  }

  static async delete(id: string) {
    const deleted = await Banner.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Banner not found");
    return deleted;
  }
}

