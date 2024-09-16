import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
   const { authorization } = req.headers;
   if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   const token = authorization.split(" ")[1];
   if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
         const refreshToken = req.headers["x-refresh-token"];
         if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
         }

         jwt.verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET as string, (err, user) => {
            if (err) {
               return res.status(401).json({ message: "Unauthorized" });
            }

            const currentUser = user as { id: string; name: string; email: string };
            const accessToken = jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET as string, {
               expiresIn: "15m",
            });

            return res.json({ accessToken });
         });
      }

      console.log(user);
      next();
   });
}
