import mongoose from "mongoose";

const ReviewsSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
   rating: { type: Number, required: true },
   comment: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
});

export type TReviews = mongoose.InferSchemaType<typeof ReviewsSchema>;
export default mongoose.model<TReviews>("Reviews", ReviewsSchema);
