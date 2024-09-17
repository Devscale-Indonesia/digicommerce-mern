import express from "express";
import * as UserRepo from "../repositories/user.repo";
import TokenModel from "../models/token.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   if (!name || !email || !password) {
      return res.status(400).json({
         message: "name, email and password are required",
      });
   }

   const findUser = await UserRepo.getUserByEmail(email);
   if (findUser) {
      return res.status(409).json({
         message: "User already exists",
      });
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const user = { name, email, password: hashedPassword };

   const newUser = await UserRepo.createUser(user);
   return res.status(201).json({ message: "User created", data: newUser });
});

router.post("/login", async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({
         message: "email and password are required",
      });
   }

   const user = await UserRepo.getUserByEmail(email);
   if (!user) {
      return res.status(401).json({
         message: "Invalid email or password",
      });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return res.status(401).json({
         message: "Invalid email or password",
      });
   }

   const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
   };

   const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "30s" });
   const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });

   const findToken = await TokenModel.findOne({ userId: user._id });
   if (findToken) {
      await TokenModel.updateOne({ userId: user._id }, { token: refreshToken });
   } else {
      const newToken = new TokenModel({ userId: user._id, token: refreshToken });
      await newToken.save();
   }

   return res
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .cookie("accessToken", accessToken)
      .status(200)
      .json({
         message: "User logged in",
         data: payload,
      });
});

export default router;
