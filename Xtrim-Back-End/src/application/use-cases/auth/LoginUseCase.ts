import { AuthService } from "@domain/services/AuthService";

export class LoginUseCase {
  constructor(private authService: AuthService) {}

  execute(username: string, password: string): { token: string } {
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username !== validUsername || password !== validPassword) {
      throw new Error("Credenciales incorrectas");
    }

    const token = this.authService.generateToken({ username, role: "admin" });
    return { token };
  }
}
