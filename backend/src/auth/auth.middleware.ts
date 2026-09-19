import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const payload = jwt.verify(token, jwtSecret);

    console.log(payload);

    if (
      typeof payload === "string" ||
      !payload.sub ||
      typeof payload.role !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    res.locals.user = {
      id: Number(payload.sub),
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export function authorize(...allowedRoles: string[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}
