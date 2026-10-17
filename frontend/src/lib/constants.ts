export const SRI_LANKAN_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
] as const;

export const SITE_CONFIG = {
  name: "Colombo Gold Covering",
  tagline: "Sri Lanka's Premier Gold-Covered & Gold-Plated Jewellery",
  whatsappNumber: "94771234567",
  formattedWhatsApp: "+94 77 123 4567",
  phone: "+94 11 288 9000",
  email: "info@colombogoldcovering.lk",
  address: "No. 142/B, High Level Road, Sri Jayawardenepura Kotte, Colombo, Sri Lanka",
  tiktokUrl: "https://www.tiktok.com/@colombogoldcovering",
  tiktokHandle: "@colombogoldcovering",
  facebookUrl: "https://facebook.com/colombogoldcovering",
  instagramUrl: "https://instagram.com/colombogoldcovering",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Offers", href: "/offers" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  confirmed: { label: "Confirmed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  processing: { label: "Processing", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  shipped: { label: "Shipped", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  delivered: { label: "Delivered", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  cancelled: { label: "Cancelled", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
};

export const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  pending_verification: { label: "Verification Required", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  paid: { label: "Paid", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  failed: { label: "Failed", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  refunded: { label: "Refunded", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
};

