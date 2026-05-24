import jwt from "jsonwebtoken";
import { AuthService } from "@domain/services/AuthService";

export class JwtService implements AuthService {
  private readonly secret: string;
  private readonly expiresIn = "8h";

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    this.secret = secret;
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): object | null {
    try {
      return jwt.verify(token, this.secret) as object;
    } catch {
      return null;
    }
  }
}
