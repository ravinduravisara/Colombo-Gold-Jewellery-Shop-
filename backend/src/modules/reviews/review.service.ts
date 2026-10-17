import { Review, IReview } from "./review.model";
import { Product } from "../products/product.model";
import { Order } from "../orders/order.model";
import { ApiError } from "../../utils/ApiError";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export class ReviewService {
  static async getProductReviews(productId: string, query: any) {
    const { page, limit, skip } = getPagination(query, 10);
    const filter = { product: productId, status: "approved" };

    const [total, reviews] = await Promise.all([
      Review.countDocuments(filter),
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return {
      reviews,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async submitReview(
    userId: string,
    userName: string,
    data: { productId: string; rating: number; title?: string; comment: string }
  ) {
    const product = await Product.findById(data.productId);
    if (!product || product.isArchived) {
      throw ApiError.notFound("Product not found");
    }

    // Check if customer made a verified purchase of this product
    const verifiedOrder = await Order.exists({
      customer: userId,
      "items.product": product._id,
      paymentStatus: "paid",
    });

    const review = await Review.create({
      product: product._id,
      user: userId,
      userName,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      status: "pending", // Requires admin approval
      isVerifiedPurchase: Boolean(verifiedOrder),
    });

    return review;
  }

  // Admin moderation
  static async listAdminReviews(query: any) {
    const { page, limit, skip } = getPagination(query, 15);
    const filter: any = {};
    if (query.status) filter.status = query.status;

    const [total, reviews] = await Promise.all([
      Review.countDocuments(filter),
      Review.find(filter)
        .populate("product", "name slug images")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      reviews,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async updateReviewStatus(
    reviewId: string,
    status: "approved" | "rejected",
    adminFeedback?: string
  ) {
    const review = await Review.findById(reviewId);
    if (!review) throw ApiError.notFound("Review not found");

    review.status = status;
    if (adminFeedback) review.adminFeedback = adminFeedback;
    await review.save();

    // Recalculate product rating if approved
    if (status === "approved" || review.status === "approved") {
      const approvedReviews = await Review.find({
        product: review.product,
        status: "approved",
      });

      const count = approvedReviews.length;
      const avg = count > 0 ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count : 5.0;

      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: count,
      });
    }

    return review;
  }
}

