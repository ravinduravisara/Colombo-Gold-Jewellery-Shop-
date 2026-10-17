import { connectDatabase } from "../config/database";
import { seedAdmin } from "./seedAdmin";
import { seedCategories } from "./seedCategories";
import { Collection } from "../modules/collections/collection.model";
import { Product } from "../modules/products/product.model";
import { WebsiteSettings } from "../modules/settings/settings.model";
import { ShippingZone } from "../modules/shipping/shipping.model";
import { Banner } from "../modules/banners/banner.model";
import { GalleryMedia } from "../modules/gallery/gallery.model";
import { ContentPage } from "../modules/content/content.model";
import { Coupon } from "../modules/coupons/coupon.model";
import { generateSlug } from "../utils/slugify";

export const seedDemoData = async () => {
  console.log("=================================================");
  console.log("🚀 Starting Colombo Gold Covering Seeding Process");
  console.log("=================================================");

  // 1. Seed Super Admin
  await seedAdmin();

  // 2. Seed Categories
  const categories = await seedCategories();
  const catMap = new Map(categories.map((c) => [c.name, c._id]));

  // 3. Seed Collections
  console.log("\n🌱 Seeding Collections...");
  const initialCollections = [
    {
      name: "Royal Heritage Collection",
      description: "Timeless handcrafted traditional Sri Lankan jewellery inspired by royal artistry.",
      bannerImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "Bridal Elegance 2026",
      description: "Magnificent gold-covered bridal suites designed to make your wedding moments unforgettable.",
      bannerImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: "Daily Glamour & Office Wear",
      description: "Subtle, lightweight, and durable gold-plated jewellery perfect for everyday sophistication.",
      bannerImage: "https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=1200&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 3,
    },
  ];

  const colMap = new Map();
  for (const col of initialCollections) {
    const slug = generateSlug(col.name);
    let existing = await Collection.findOne({ slug });
    if (!existing) {
      existing = await Collection.create({ ...col, slug });
      console.log(`✅ Collection created: ${col.name}`);
    }
    colMap.set(col.name, existing._id);
  }

  // 4. Seed Website Settings
  console.log("\n🌱 Seeding Website Settings...");
  let settings = await WebsiteSettings.findOne();
  if (!settings) {
    settings = await WebsiteSettings.create({
      storeName: "Colombo Gold Covering",
      tagline: "Sri Lanka's Premier Gold-Covered & Gold-Plated Jewellery",
      contactEmail: "info@colombogoldcovering.lk",
      contactPhone: "+94 11 288 9000",
      whatsappNumber: "94771234567",
      address: "No. 142/B, High Level Road, Sri Jayawardenepura Kotte, Colombo",
      city: "Kotte",
      district: "Colombo",
      country: "Sri Lanka",
      currency: "LKR",
      currencySymbol: "Rs.",
      freeShippingThreshold: 1500000, // Rs. 15,000
      defaultDeliveryFee: 35000, // Rs. 350
      bankDetails: {
        bankName: "Commercial Bank of Ceylon",
        branchName: "Kotte Branch",
        accountName: "Colombo Gold Covering",
        accountNumber: "1000289192",
        instructions:
          "Please transfer the exact order amount to the bank account above and upload the slip or WhatsApp it to +94 77 123 4567 with your order number.",
        isActive: true,
      },
      socialLinks: {
        tiktok: "https://www.tiktok.com/@colombogoldcovering",
        facebook: "https://facebook.com/colombogoldcovering",
        instagram: "https://instagram.com/colombogoldcovering",
        youtube: "https://youtube.com/@colombogoldcovering",
      },
      announcementBar: {
        enabled: true,
        text: "✨ Islandwide Delivery Across Sri Lanka | Premium 6-Month Gold-Covering Guarantee! ✨",
        link: "/shop",
      },
      seo: {
        metaTitle: "Colombo Gold Covering — Premium Gold-Plated Jewellery Sri Lanka",
        metaDescription:
          "Buy authentic 24K and 22K micro gold-covered necklaces, bridal jewellery sets, bangles, and earrings in Sri Lanka. High quality finish with re-polishing warranty.",
        metaKeywords: [
          "gold covered jewellery sri lanka",
          "gold plated jewellery colombo",
          "gold covering necklace",
          "bridal jewellery set sri lanka",
          "kotte jewellery",
        ],
      },
    });
    console.log("✅ Website settings created");
  }

  // 5. Seed Shipping Zones (Sri Lankan Districts)
  console.log("\n🌱 Seeding Shipping Zones...");
  const shippingDistricts = [
    { district: "Colombo", deliveryFee: 30000, estimatedDays: "1-2 Business Days" },
    { district: "Gampaha", deliveryFee: 35000, estimatedDays: "1-3 Business Days" },
    { district: "Kalutara", deliveryFee: 35000, estimatedDays: "2-3 Business Days" },
    { district: "Kandy", deliveryFee: 40000, estimatedDays: "2-4 Business Days" },
    { district: "Galle", deliveryFee: 40000, estimatedDays: "2-4 Business Days" },
    { district: "Matara", deliveryFee: 40000, estimatedDays: "2-4 Business Days" },
    { district: "Kurunegala", deliveryFee: 40000, estimatedDays: "2-4 Business Days" },
    { district: "Jaffna", deliveryFee: 45000, estimatedDays: "3-5 Business Days" },
    { district: "All Island (Other Districts)", deliveryFee: 40000, estimatedDays: "2-5 Business Days" },
  ];

  for (const s of shippingDistricts) {
    const existing = await ShippingZone.findOne({ district: s.district });
    if (!existing) {
      await ShippingZone.create(s);
      console.log(`✅ Shipping zone created: ${s.district}`);
    }
  }

  // 6. Seed Coupons
  console.log("\n🌱 Seeding Coupons...");
  const existingCoupon = await Coupon.findOne({ code: "GOLD10" });
  if (!existingCoupon) {
    await Coupon.create({
      code: "GOLD10",
      discountType: "percentage",
      discountValue: 10,
      minPurchaseAmount: 500000, // Rs. 5,000
      maxDiscountAmount: 200000, // Rs. 2,000
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      isActive: true,
    });
    await Coupon.create({
      code: "WELCOME500",
      discountType: "fixed",
      discountValue: 50000, // Rs. 500
      minPurchaseAmount: 400000, // Rs. 4,000
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
      isActive: true,
    });
    console.log("✅ Coupons GOLD10 and WELCOME500 created");
  }

  // 7. Seed Banners
  console.log("\n🌱 Seeding Banners...");
  const existingBanner = await Banner.findOne();
  if (!existingBanner) {
    await Banner.create([
      {
        title: "Eternal Radiance in Every Detail",
        subtitle: "Luxury 24K & 22K Micro Gold-Covered Jewellery Crafted for Your Special Moments",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
        buttonText: "Shop Collection",
        buttonLink: "/shop",
        secondaryButtonText: "Special Offers",
        secondaryButtonLink: "/offers",
        position: "hero",
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Bridal Splendour & Heritage Heirlooms",
        subtitle: "Exquisite Traditional Sri Lankan Necklaces, Bangles & Jimikkis with 6-Month Guarantee",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop",
        buttonText: "Explore Bridal Suites",
        buttonLink: "/collections/bridal-elegance-2026",
        secondaryButtonText: "WhatsApp Order",
        secondaryButtonLink: "https://wa.me/94771234567",
        position: "hero",
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "Flash Festive Season Offer",
        subtitle: "Get up to 20% off on all jewellery sets. Free islandwide express delivery on orders over Rs. 15,000.",
        imageUrl: "https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=1600&auto=format&fit=crop",
        buttonText: "View Festive Deals",
        buttonLink: "/offers",
        position: "promo",
        displayOrder: 1,
        isActive: true,
      },
    ]);
    console.log("✅ Hero & promotional banners created");
  }

  // 8. Seed Gallery Media & TikTok Showcases
  console.log("\n🌱 Seeding Gallery & TikTok Media...");
  const existingGallery = await GalleryMedia.findOne();
  if (!existingGallery) {
    await GalleryMedia.create([
      {
        title: "Royal Bridal Choker Showcase",
        type: "tiktok",
        mediaUrl: "https://www.tiktok.com/@colombogoldcovering",
        thumbnailUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
        caption: "Watch our master polisher demonstrate the brilliant micro-gold finish on this royal choker! ✨",
        tiktokUsername: "@colombogoldcovering",
        isFeatured: true,
        displayOrder: 1,
      },
      {
        title: "Traditional Jimikki Earrings Movement",
        type: "tiktok",
        mediaUrl: "https://www.tiktok.com/@colombogoldcovering",
        thumbnailUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop",
        caption: "Delicate chime and pure 22K gold lustre. Perfect for weddings and festival celebrations.",
        tiktokUsername: "@colombogoldcovering",
        isFeatured: true,
        displayOrder: 2,
      },
      {
        title: "Stone Studded Bangles Shine Test",
        type: "tiktok",
        mediaUrl: "https://www.tiktok.com/@colombogoldcovering",
        thumbnailUrl: "https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=600&auto=format&fit=crop",
        caption: "High durability water and sweat resistance testing on our premium gold-covering range.",
        tiktokUsername: "@colombogoldcovering",
        isFeatured: true,
        displayOrder: 3,
      },
      {
        title: "Intricate Floral Choker Detail",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400&auto=format&fit=crop",
        caption: "Handcrafted filigree work with Austrian crystals and double micro-gold plating.",
        isFeatured: true,
        displayOrder: 4,
      },
    ]);
    console.log("✅ Gallery items and TikTok showcases created");
  }

  // 9. Seed CMS Pages
  console.log("\n🌱 Seeding CMS Pages...");
  const pages = [
    {
      slug: "about-us",
      title: "About Colombo Gold Covering",
      metaTitle: "About Us | Colombo Gold Covering Sri Lanka",
      metaDescription: "Discover the heritage, artistry, and craftsmanship behind Colombo Gold Covering, Sri Lanka's trusted gold-plated jewellery destination.",
      content: `
        <h2>Our Heritage & Philosophy</h2>
        <p>Located in Sri Jayawardenepura Kotte, Colombo Gold Covering is dedicated to creating accessible luxury. We specialize in high-calibre gold-covered and gold-plated jewellery that captures the timeless radiance of solid gold without compromise.</p>
        
        <h2>Master Electroplating & Durability</h2>
        <p>Every piece in our collection is precision-cast from premium hypoallergenic brass and copper alloys, followed by multiple layers of 24K and 22K micro-gold plating. This advanced gold-covering technology ensures deep colour retention, radiant shine, and resilience against daily wear.</p>
        
        <h2>Our Commitment to You</h2>
        <p>We stand behind every piece of jewellery we sell. Each item comes with our official warranty certificate, and we offer dedicated re-polishing and maintenance services so your treasured pieces remain as luminous as the day you first wore them.</p>
      `,
    },
    {
      slug: "warranty",
      title: "Product Warranty & Guarantee Policy",
      metaTitle: "Warranty & Guarantee | Colombo Gold Covering",
      metaDescription: "Learn about our 6-month gold covering warranty, re-polishing privileges, and jewellery care guidelines.",
      content: `
        <h2>6-Month Gold-Covering Guarantee</h2>
        <p>All Colombo Gold Covering jewellery is backed by our signature 6-Month Guarantee against peeling, discoloration, or manufacturing defects under standard personal use.</p>
        
        <h2>Re-Polishing Privileges</h2>
        <p>Should your jewellery experience natural fading over extended wear, we provide complimentary or subsidized re-plating services at our Kotte workshop.</p>
        
        <h2>Care Guidelines</h2>
        <ul>
          <li>Avoid spraying perfume, hairspray, or alcohol directly on gold-covered surfaces.</li>
          <li>Remove your jewellery before swimming, bathing, or engaging in strenuous exercise.</li>
          <li>Store each piece individually in our velvet jewellery pouch to avoid scratching.</li>
        </ul>
      `,
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      metaTitle: "FAQ | Colombo Gold Covering",
      metaDescription: "Find answers to questions about delivery, payments, WhatsApp ordering, warranty, and gold covering quality.",
      content: `
        <h2>What is Gold Covering?</h2>
        <p>Gold covering (micro gold plating) is an advanced metallurgical technique where a generous layer of authentic 24K or 22K gold is electro-deposited over a premium base metal core. It has the identical weight, visual luster, and tactile feel of solid gold jewellery.</p>
        
        <h2>How do I order via WhatsApp?</h2>
        <p>Simply click the "Order via WhatsApp" button on any product page. A pre-formatted message with the product name, SKU, price, and your chosen size will be prepared for you. Send it to our customer care team at +94 77 123 4567, and we will confirm your order immediately.</p>
        
        <h2>What payment methods are available?</h2>
        <p>We accept Cash on Delivery (COD) for most Sri Lankan districts, as well as Direct Bank Transfer with instant online verification.</p>
        
        <h2>How long does islandwide delivery take?</h2>
        <p>Delivery within Colombo and Gampaha takes 1 to 2 business days. Outstation delivery to Kandy, Galle, Matara, Jaffna, and other districts takes 2 to 4 business days via our tracked courier partners.</p>
      `,
    },
    {
      slug: "terms",
      title: "Terms and Conditions",
      metaTitle: "Terms & Conditions | Colombo Gold Covering",
      metaDescription: "Official terms and conditions for orders, deliveries, and services provided by Colombo Gold Covering.",
      content: `
        <h2>General Terms</h2>
        <p>By using the Colombo Gold Covering website, placing orders online, or communicating via WhatsApp, you agree to comply with our terms and conditions.</p>
        
        <h2>Pricing and Currency</h2>
        <p>All prices listed on this website are denominated in Sri Lankan Rupees (LKR) and include relevant local taxes unless otherwise stated.</p>
        
        <h2>Delivery & Acceptance</h2>
        <p>Customers are responsible for providing accurate delivery addresses and contact phone numbers. For Cash on Delivery orders, payment must be handed over to the courier representative upon delivery.</p>
      `,
    },
    {
      slug: "privacy-policy",
      title: "Customer Privacy Policy",
      metaTitle: "Privacy Policy | Colombo Gold Covering",
      metaDescription: "Our commitment to protecting your personal information, contact data, and privacy.",
      content: `
        <h2>Information We Collect</h2>
        <p>We only collect personal information required to process and deliver your jewellery orders, including your name, contact phone number, delivery address, and email.</p>
        
        <h2>Bank Transfer Receipts</h2>
        <p>Uploaded payment slips and screenshots are encrypted and only accessible to authorized administrative staff for transaction verification.</p>
        
        <h2>No Third-Party Sharing</h2>
        <p>We respect your privacy and never sell, rent, or trade your personal information to third parties.</p>
      `,
    },
  ];

  for (const p of pages) {
    const existing = await ContentPage.findOne({ slug: p.slug });
    if (!existing) {
      await ContentPage.create(p);
      console.log(`✅ CMS Page created: ${p.title}`);
    }
  }

  // 10. Seed Demo Products
  console.log("\n🌱 Seeding Products...");
  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    const demoProducts = [
      {
        name: "Royal Peacock Bridal Choker Necklace",
        sku: "CGC-NK-101",
        category: catMap.get("Necklaces"),
        collectionRef: colMap.get("Royal Heritage Collection"),
        shortDescription: "Majestic 24K micro gold-covered traditional choker featuring sculpted peacocks and ruby-red Austrian crystals.",
        description: `Indulge in royal Sri Lankan heritage with this breathtaking peacock choker necklace. Precision-coated with 24K micro gold electroplating, this piece shines with warm amber lustre that mimics solid heirloom jewellery. The central motif showcases dual dancing peacocks surrounded by hand-set teardrop crystals and suspended pearl droplets. Includes matching adjustable rope dori for custom neck fitting.`,
        regularPrice: 1850000, // Rs. 18,500
        discountPrice: 1650000, // Rs. 16,500
        stockQuantity: 12,
        lowStockThreshold: 3,
        warrantyMonths: 12,
        warrantyDetails: "1 Year Colombo Gold Covering Guarantee with complimentary re-polishing privilege.",
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        salesCount: 38,
        rating: 4.9,
        reviewCount: 16,
        images: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
            altText: "Royal Peacock Bridal Choker Necklace",
          },
          {
            url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
            isPrimary: false,
            altText: "Peacock choker craftsmanship detail",
          },
        ],
        specifications: {
          "Base Metal": "Premium Copper & Brass Alloy",
          "Plating Finish": "24K High-Micron Gold Covering",
          "Gemstones": "AAA Grade Austrian Crystals & Faux Pearls",
          "Closure": "Adjustable Handwoven Silk Dori",
          "Origin": "Sri Lanka",
        },
        variants: [
          {
            sku: "CGC-NK-101-RED",
            name: "Ruby Red Stones",
            stockQuantity: 8,
            attributes: { color: "Ruby Red", finish: "24K Antique Gold" },
          },
          {
            sku: "CGC-NK-101-GRN",
            name: "Emerald Green Stones",
            stockQuantity: 4,
            attributes: { color: "Emerald Green", finish: "24K Antique Gold" },
          },
        ],
      },
      {
        name: "Traditional Sri Lankan Jimikki Earrings",
        sku: "CGC-ER-201",
        category: catMap.get("Earrings"),
        collectionRef: colMap.get("Royal Heritage Collection"),
        shortDescription: "Classic tiered bell jimikkis with micro filigree detailing and melodic golden bead hangings.",
        description: `An essential festive staple for weddings and cultural ceremonies. These timeless bell-shaped jimikkis feature ornate lotus filigree work with a rich 22K gold coating. Lightweight core alloy makes them comfortable to wear throughout entire wedding events without earlobe fatigue.`,
        regularPrice: 650000, // Rs. 6,500
        discountPrice: 580000, // Rs. 5,800
        stockQuantity: 25,
        lowStockThreshold: 5,
        warrantyMonths: 6,
        warrantyDetails: "6 Months Gold Covering Warranty against natural discoloration.",
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        salesCount: 84,
        rating: 5.0,
        reviewCount: 32,
        images: [
          {
            url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
            altText: "Traditional Gold Jimikki Earrings",
          },
        ],
        specifications: {
          "Base Metal": "Jewellery Brass Alloy",
          "Plating Finish": "22K Micro Gold Plated",
          "Weight": "16 grams (pair)",
          "Backing Type": "Push Back with Safety Screw",
        },
        variants: [
          {
            sku: "CGC-ER-201-MED",
            name: "Medium (3.5 cm)",
            stockQuantity: 15,
            attributes: { size: "Medium", drop: "3.5 cm" },
          },
          {
            sku: "CGC-ER-201-LRG",
            name: "Large (5 cm)",
            price: 750000,
            discountPrice: 680000,
            stockQuantity: 10,
            attributes: { size: "Large", drop: "5.0 cm" },
          },
        ],
      },
      {
        name: "Stone-Studded Heritage Kada Bangles (Pair)",
        sku: "CGC-BG-301",
        category: catMap.get("Bangles"),
        collectionRef: colMap.get("Bridal Elegance 2026"),
        shortDescription: "Pair of openable Kada bangles adorned with sparkling white stones and intricate milgrain borders.",
        description: `Exude timeless elegance with this pair of handcrafted gold-covered Kada bangles. Designed with a secure concealed side hinge and safety clasp, these bangles slide easily onto the wrist and stay locked securely. Coated in heavy 24K gold covering for long-lasting brilliance.`,
        regularPrice: 1250000, // Rs. 12,500
        discountPrice: 1100000, // Rs. 11,000
        stockQuantity: 18,
        lowStockThreshold: 4,
        warrantyMonths: 6,
        warrantyDetails: "6 Months Warranty on Gold Plating and Stone Setting.",
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        salesCount: 42,
        rating: 4.8,
        reviewCount: 19,
        images: [
          {
            url: "https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
            altText: "Kada Bangles Pair",
          },
        ],
        specifications: {
          "Quantity": "Pair (2 Bangles)",
          "Clasp": "Concealed Hinge with Safety Lock",
          "Plating": "24K Micro Gold Plated",
          "Stones": "Brilliant White Cubic Zirconia",
        },
        variants: [
          {
            sku: "CGC-BG-301-24",
            name: "Size 2.4",
            stockQuantity: 6,
            attributes: { size: "2.4", diameter: "57.2 mm" },
          },
          {
            sku: "CGC-BG-301-26",
            name: "Size 2.6",
            stockQuantity: 8,
            attributes: { size: "2.6", diameter: "60.3 mm" },
          },
          {
            sku: "CGC-BG-301-28",
            name: "Size 2.8",
            stockQuantity: 4,
            attributes: { size: "2.8", diameter: "63.5 mm" },
          },
        ],
      },
      {
        name: "Classic 24K Micro Gold Rope Chain (24 Inches)",
        sku: "CGC-CH-401",
        category: catMap.get("Chains"),
        collectionRef: colMap.get("Daily Glamour & Office Wear"),
        shortDescription: "Substantial 4mm diamond-cut twisted rope chain with heavy-duty lobster clasp.",
        description: `A masterwork of subtle luxury. This 24-inch twisted rope chain is diamond-cut along every intertwining link to catch light from all angles. Plated with high-micron 24K gold over solid core brass, it offers superior wear resistance against sweat and moisture.`,
        regularPrice: 780000, // Rs. 7,800
        discountPrice: 690000, // Rs. 6,900
        stockQuantity: 20,
        lowStockThreshold: 4,
        warrantyMonths: 6,
        warrantyDetails: "6 Months Warranty on Gold Plating.",
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        salesCount: 95,
        rating: 4.9,
        reviewCount: 28,
        images: [
          {
            url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
            altText: "Rope Chain 24 Inches",
          },
        ],
        specifications: {
          "Length": "24 Inches (60.9 cm)",
          "Thickness": "4 mm",
          "Clasp": "Reinforced Lobster Clasp",
          "Plating": "24K Diamond-Cut Gold Covering",
        },
        variants: [
          {
            sku: "CGC-CH-401-20",
            name: "20 Inches",
            price: 680000,
            discountPrice: 590000,
            stockQuantity: 10,
            attributes: { length: "20 Inches" },
          },
          {
            sku: "CGC-CH-401-24",
            name: "24 Inches",
            stockQuantity: 10,
            attributes: { length: "24 Inches" },
          },
        ],
      },
      {
        name: "Solitaire Crown Gold Plated Ring",
        sku: "CGC-RG-501",
        category: catMap.get("Rings"),
        collectionRef: colMap.get("Daily Glamour & Office Wear"),
        shortDescription: "Regal six-prong solitaire ring with accent pave crystals set in micro gold-plated band.",
        description: `An exquisite statement of poise and romance. The centerpiece features a high-grade 2-carat diamond simulant anchored in a royal six-prong crown setting, elevated by shimmering pave crystals along the band.`,
        regularPrice: 420000, // Rs. 4,200
        discountPrice: 360000, // Rs. 3,600
        stockQuantity: 30,
        lowStockThreshold: 5,
        warrantyMonths: 6,
        warrantyDetails: "6 Months Guarantee on Gold Plating.",
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        salesCount: 31,
        rating: 4.9,
        reviewCount: 14,
        images: [
          {
            url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
            altText: "Solitaire Crown Ring",
          },
        ],
        specifications: {
          "Stone": "High Dispersion Cubic Zirconia",
          "Plating": "24K Micro Gold Covering",
          "Band Width": "2 mm",
        },
        variants: [
          {
            sku: "CGC-RG-501-US6",
            name: "Size 6 (16.5 mm)",
            stockQuantity: 10,
            attributes: { size: "US 6" },
          },
          {
            sku: "CGC-RG-501-US7",
            name: "Size 7 (17.3 mm)",
            stockQuantity: 12,
            attributes: { size: "US 7" },
          },
          {
            sku: "CGC-RG-501-US8",
            name: "Size 8 (18.1 mm)",
            stockQuantity: 8,
            attributes: { size: "US 8" },
          },
        ],
      },
      {
        name: "Complete Mahamaya Bridal Jewellery Set",
        sku: "CGC-SET-601",
        category: catMap.get("Jewellery Sets"),
        collectionRef: colMap.get("Bridal Elegance 2026"),
        shortDescription: "Complete bridal set featuring grand choker, long haram necklace, matching jimikkis, and maang tikka.",
        description: `The pinnacle of luxury bridal jewellery. The Mahamaya Bridal Set includes a regal collar choker, a cascading long necklace (haram), matching royal jimikkis with ear chains (mattal), and a delicate maang tikka forehead ornament. Hand-set with radiant red and green gemstones and genuine 24K antique micro-gold plating.`,
        regularPrice: 4250000, // Rs. 42,500
        discountPrice: 3750000, // Rs. 37,500
        stockQuantity: 5,
        lowStockThreshold: 2,
        warrantyMonths: 12,
        warrantyDetails: "1 Year Official Colombo Gold Covering Bridal Warranty with free annual re-polishing.",
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        salesCount: 18,
        rating: 5.0,
        reviewCount: 12,
        images: [
          {
            url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
            isPrimary: true,
            altText: "Complete Bridal Jewellery Set",
          },
        ],
        specifications: {
          "Included Pieces": "Choker, Long Haram, Pair of Jimikkis with Mattal, Maang Tikka",
          "Plating": "24K Antique Micro Gold Plated",
          "Packaging": "Velvet Lined Luxury Wooden Gift Case",
        },
        variants: [
          {
            sku: "CGC-SET-601-RED",
            name: "Kandyan Ruby & Gold Suite",
            stockQuantity: 3,
            attributes: { theme: "Ruby Red & Gold" },
          },
          {
            sku: "CGC-SET-601-ALLWHT",
            name: "Royal White Crystal Suite",
            stockQuantity: 2,
            attributes: { theme: "Crystal White & Gold" },
          },
        ],
      },
    ];

    for (const p of demoProducts) {
      const slug = generateSlug(p.name);
      await Product.create({
        ...p,
        slug,
      });
      console.log(`✅ Product created: ${p.name} [Rs. ${(p.regularPrice / 100).toLocaleString("en-LK")}]`);
    }
  }

  console.log("=================================================");
  console.log("🎉 Seeding Completed Successfully!");
  console.log(`👉 Super Admin: ${ENV.INITIAL_SUPERADMIN.EMAIL}`);
  console.log(`👉 Password: ${ENV.INITIAL_SUPERADMIN.PASSWORD}`);
  console.log("=================================================");
};

if (require.main === module) {
  connectDatabase()
    .then(async () => {
      await seedDemoData();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}

