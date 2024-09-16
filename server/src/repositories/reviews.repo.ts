import reviewsModel, { TReviews } from "../models/reviews.model";

export async function getProductReviews(productId: string) {
   const reviews = await reviewsModel.find({ productId });
   return reviews;
}

export async function getUserReviews(userId: string) {
   const reviews = await reviewsModel.find({ userId });
   return reviews;
}

export async function createReview(review: TReviews) {
   const newReview = new reviewsModel(review);
   const savedReview = await newReview.save();
   return savedReview;
}

export async function deleteReview(reviewId: string) {
   const deletedReview = await reviewsModel.findByIdAndDelete(reviewId);
   return deletedReview;
}
