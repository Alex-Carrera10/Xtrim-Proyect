export interface AuthService {
  generateToken(payload: object): string;
  verifyToken(token: string): object | null;
}
