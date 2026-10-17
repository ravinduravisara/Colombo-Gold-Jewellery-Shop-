import { Collection } from "./collection.model";
import { generateSlug } from "../../utils/slugify";
import { ApiError } from "../../utils/ApiError";

export class CollectionService {
  static async getAll(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return Collection.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  }

  static async getBySlug(slug: string) {
    const collection = await Collection.findOne({ slug: slug.toLowerCase() });
    if (!collection) throw ApiError.notFound("Collection not found");
    return collection;
  }

  static async create(data: { name: string; description?: string; bannerImage?: string; thumbnailImage?: string; isFeatured?: boolean }) {
    const slug = generateSlug(data.name);
    const existing = await Collection.findOne({ slug });
    if (existing) throw ApiError.conflict("Collection with this name already exists");

    return Collection.create({
      ...data,
      slug,
    });
  }

  static async update(id: string, data: any) {
    const collection = await Collection.findById(id);
    if (!collection) throw ApiError.notFound("Collection not found");

    if (data.name && data.name !== collection.name) {
      collection.slug = generateSlug(data.name);
    }

    Object.assign(collection, data);
    await collection.save();
    return collection;
  }

  static async delete(id: string) {
    const deleted = await Collection.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Collection not found");
    return deleted;
  }
}

