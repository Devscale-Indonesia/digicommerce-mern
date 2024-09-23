import express from "express";
import { google } from "../utils/arctic";

export const callbackRouter = express.Router();

callbackRouter.get("/login/google/callback", async (req, res) => {
   // get from URL
   const code = req.query.code as string;

   // get from Cookies
   const { codeVerifier } = req.cookies;

   // check
   if (!code || !codeVerifier) {
      return res.json({ message: "failed" });
   }

   // validate the code => 4: accessToken, RefreshToken, accessId, id
   const tokens = await google.validateAuthorizationCode(code, codeVerifier);

   // fetching from userInfo API endpoint GOOGLE. https://openidconnect.googleapis.com/v1/userinfo
   const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
         Authorization: `Bearer ${tokens.accessToken}`,
      },
   });

   // convert to json
   const user = await response.json();

   // Login Strategy
   return res.json({ user });
});
