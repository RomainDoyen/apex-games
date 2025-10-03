import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './interfaces/auth.interface';

@Controller('auth')
@UseGuards(ThrottlerGuard) // Rate limiting global pour les routes d'auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  logout(): { message: string } {
    return this.authService.logout();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User): User {
    return user;
  }

  @Get('verify')
  verifyToken(
    @CurrentUser() user: User,
  ): { valid: boolean; user: User } {
    return {
      valid: true,
      user,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
