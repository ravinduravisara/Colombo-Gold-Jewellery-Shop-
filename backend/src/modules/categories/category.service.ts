import { Category } from "./category.model";
import { Product } from "../products/product.model";
import { generateSlug } from "../../utils/slugify";
import { ApiError } from "../../utils/ApiError";

export class CategoryService {
  static async getAll(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();

    // Attach item count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          isPublished: true,
          isArchived: false,
        });
        return { ...cat, itemCount: count };
      })
    );

    return categoriesWithCount;
  }

  static async getBySlug(slug: string) {
    const category = await Category.findOne({ slug: slug.toLowerCase() });
    if (!category) throw ApiError.notFound("Category not found");
    return category;
  }

  static async create(data: { name: string; description?: string; image?: string; displayOrder?: number }) {
    const slug = generateSlug(data.name);
    const existing = await Category.findOne({ slug });
    if (existing) throw ApiError.conflict("Category with this name already exists");

    return Category.create({
      ...data,
      slug,
    });
  }

  static async update(id: string, data: Partial<{ name: string; description?: string; image?: string; displayOrder?: number; isActive?: boolean }>) {
    const category = await Category.findById(id);
    if (!category) throw ApiError.notFound("Category not found");

    if (data.name && data.name !== category.name) {
      category.slug = generateSlug(data.name);
    }

    Object.assign(category, data);
    await category.save();
    return category;
  }

  static async delete(id: string) {
    const inUse = await Product.exists({ category: id, isArchived: false });
    if (inUse) {
      throw ApiError.badRequest("Cannot delete category containing active products. Reassign products first.");
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Category not found");
    return deleted;
  }
}

