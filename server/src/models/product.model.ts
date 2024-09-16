import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
   name: { type: String, required: true },
   description: { type: String, required: true },
   price: { type: Number, required: true },
   category: { type: String, required: true },
   images: { type: [String], required: true },
   tags: { type: [String] },
   authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   createdAt: { type: Date, default: Date.now },
});

export type TProduct = Omit<mongoose.InferSchemaType<typeof ProductSchema>, "createdAt">;
export default mongoose.model<TProduct>("Product", ProductSchema);
