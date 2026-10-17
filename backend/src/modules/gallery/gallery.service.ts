import { GalleryMedia, IGalleryMedia } from "./gallery.model";
import { ApiError } from "../../utils/ApiError";

export class GalleryService {
  static async getActive(type?: string) {
    const filter: any = { isActive: true };
    if (type) filter.type = type;
    return GalleryMedia.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  }

  static async listAdminAll() {
    return GalleryMedia.find().sort({ displayOrder: 1, createdAt: -1 });
  }

  static async create(data: any) {
    if (data.mediaType && !data.type) {
      data.type = data.mediaType.includes("tiktok") ? "tiktok" : "image";
    }
    return GalleryMedia.create(data);
  }

  static async update(id: string, data: any) {
    if (data.mediaType && !data.type) {
      data.type = data.mediaType.includes("tiktok") ? "tiktok" : "image";
    }
    const media = await GalleryMedia.findByIdAndUpdate(id, data, { new: true });
    if (!media) throw ApiError.notFound("Gallery item not found");
    return media;
  }

  static async delete(id: string) {
    const deleted = await GalleryMedia.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Gallery item not found");
    return deleted;
  }
}

