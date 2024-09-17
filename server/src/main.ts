import express from "express";
import cors from "cors";
import dbConnect from "./utils/db";
import authRouter from "./router/auth.router";
import productRouter from "./router/product.router";

const app = express();

// config
dbConnect();
app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
   }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.listen(8000, () => console.log("server running on port 8000"));
