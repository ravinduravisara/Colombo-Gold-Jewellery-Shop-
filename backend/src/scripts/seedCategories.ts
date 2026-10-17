import { Category } from "../modules/categories/category.model";
import { generateSlug } from "../utils/slugify";
import { connectDatabase } from "../config/database";

export const initialCategories = [
  {
    name: "Necklaces",
    description: "Exquisite 24K and 22K micro gold-covered necklaces, bridal chokers, and modern pendants.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    displayOrder: 1,
  },
  {
    name: "Earrings",
    description: "Traditional Sri Lankan jimikkis, elegant studs, drop earrings, and festive chandelier designs.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    displayOrder: 2,
  },
  {
    name: "Bangles",
    description: "Durable gold-plated bangles, classic stone-studded designs, and traditional wedding sets.",
    image: "https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=800&auto=format&fit=crop",
    displayOrder: 3,
  },
  {
    name: "Bracelets",
    description: "Modern tennis bracelets, charming link designs, and luxury cuff bracelets for every occasion.",
    image: "https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=800&auto=format&fit=crop",
    displayOrder: 4,
  },
  {
    name: "Rings",
    description: "Intricately finished gold-covered engagement bands, statement rings, and adjustable daily wear rings.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    displayOrder: 5,
  },
  {
    name: "Chains",
    description: "Premium rope chains, curb links, and Figaro chains with long-lasting micro-gold electroplating.",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    displayOrder: 6,
  },
  {
    name: "Jewellery Sets",
    description: "Complete matching suites featuring necklace, earrings, and bangles designed for weddings and parties.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    displayOrder: 7,
  },
  {
    name: "Other Accessories",
    description: "Pendants, anklets, and traditional hip chains with guaranteed shine and re-polishing warranty.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    displayOrder: 8,
  },
];

export const seedCategories = async () => {
  console.log("🌱 Seeding Categories...");
  const createdCats: any[] = [];

  for (const cat of initialCategories) {
    const slug = generateSlug(cat.name);
    let existing = await Category.findOne({ slug });
    if (!existing) {
      existing = await Category.create({ ...cat, slug });
      console.log(`✅ Category created: ${cat.name}`);
    } else {
      console.log(`ℹ️ Category '${cat.name}' already exists.`);
    }
    createdCats.push(existing);
  }

  return createdCats;
};

if (require.main === module) {
  connectDatabase()
    .then(async () => {
      await seedCategories();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error seeding categories:", err);
      process.exit(1);
    });
}

