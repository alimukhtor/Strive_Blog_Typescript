import createHttpError from "http-errors";
import { verifyJWT } from "./tools";
import { RequestHandler } from "express";

export const JWTAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(
        createHttpError(
          401,
          "please provide bearer token in authorization headers!"
        )
      );
    } else {
      const token = req.headers.authorization.replace("Bearer ", "");
      if (!token) return res.status(401).send({ error: "No token provided" });
      const payload = await verifyJWT(token);

      req.user = {
        _id: payload._id,
        // role:payload.role
      };
      next();
    }
  } catch (error) {
    next(createHttpError(401, "Author is unauthorized!"));
  }
};
