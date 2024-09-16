import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
   createdAt: { type: Date, default: Date.now },
});

export type TOrder = mongoose.InferSchemaType<typeof OrderSchema>;
export default mongoose.model<TOrder>("Order", OrderSchema);
