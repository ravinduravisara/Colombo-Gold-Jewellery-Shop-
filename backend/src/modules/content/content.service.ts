import { ContentPage, IContentPage } from "./content.model";
import { ApiError } from "../../utils/ApiError";

export class ContentService {
  static async getPageBySlug(slug: string) {
    const page = await ContentPage.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
    });
    if (!page) throw ApiError.notFound(`Page '${slug}' not found`);
    return page;
  }

  static async listAdminPages() {
    return ContentPage.find().sort({ title: 1 });
  }

  static async updatePage(slug: string, data: Partial<IContentPage>, adminUserId: string) {
    const page = await ContentPage.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { ...data, updatedBy: adminUserId },
      { new: true, upsert: true }
    );
    return page;
  }
}

