import mongoose from "mongoose";

export default async function dbConnect() {
   return mongoose
      .connect(process.env.MONGO_URI as string)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => {
         console.log(err);
         process.exit(1);
      });
}
