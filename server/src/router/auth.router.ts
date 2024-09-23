import express from "express";
import * as UserRepo from "../repositories/user.repo";
import TokenModel from "../models/token.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "../utils/arctic";

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

router.post("/continue-with-google", async (req, res) => {
   // generate 2 code challenge
   const state = generateState();
   const codeVerifier = generateCodeVerifier();

   console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET_CLIENT);

   // generate authorizationURL =>
   const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["profile", "email"],
   });

   return res.cookie("codeVerifier", codeVerifier).redirect(url.href);
});

router.get("/login/google/callback", async (req, res) => {
   // get from URL
   const code = req.query.code as string;

   // get from Cookies
   const { codeVerifier } = req.cookies;

   // check
   if (!code || !codeVerifier) {
      return res.json({ message: "failed" });
   }

   const tokens = await google.validateAuthorizationCode(code, codeVerifier);

   const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
         Authorization: `Bearer ${tokens.accessToken}`,
      },
   });

   const user = await response.json();

   // Login Strategy

   // check if user exists
   const findUser = await UserRepo.getUserByEmail(user.email);

   if (!findUser) {
      const newUser = await UserRepo.createUser({ name: user.name, email: user.email });

      // generate Session ID
      const payload = {
         id: newUser._id,
         name: newUser.name,
         email: newUser.email,
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
         .cookie("user", JSON.stringify(payload))
         .status(200)
         .redirect("http://localhost:5173/dashboard");
   }

   // generate Session ID
   const payload = {
      id: findUser._id,
      name: findUser.name,
      email: findUser.email,
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
      .cookie("user", JSON.stringify(payload))
      .status(200)
      .redirect("http://localhost:5173/dashboard");
});

export default router;
