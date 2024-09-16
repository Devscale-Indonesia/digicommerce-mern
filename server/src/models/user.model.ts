import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   createdAt: { type: Date, default: Date.now },
});

export type TUser = Omit<mongoose.InferSchemaType<typeof UserSchema>, "createdAt">;
export default mongoose.model<TUser>("User", UserSchema);
