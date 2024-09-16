import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   token: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Token", TokenSchema);
