import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./helper/verifyToken";
import { generateAccessToken } from "./helper/generateAccessToken";

const setAccessTokenCookie = (res: Response, token: string) => {
   res.cookie("accessToken", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
   });
};

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
   try {
      const { accessToken } = req.cookies;

      if (!accessToken) {
         return res.status(401).json({ message: "Unauthorized, no token provided" });
      }

      await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET as string);

      next();
   } catch (err) {
      // Token is invalid, let's try the refresh token
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
         return res.status(401).json({ message: "Unauthorized, no refresh token provided" });
      }

      try {
         // Verify refresh token and generate new access token
         const user = (await verifyToken(refreshToken as string, process.env.REFRESH_TOKEN_SECRET as string)) as {
            id: string;
            name: string;
            email: string;
         };

         const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
         };

         const newAccessToken = generateAccessToken(payload);

         setAccessTokenCookie(res, newAccessToken);

         next();
      } catch (_refreshError) {
         return res.status(401).json({ message: "Unauthorized, invalid refresh token" });
      }
   }
}
