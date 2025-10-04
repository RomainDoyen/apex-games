import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async testEmail(@Body() body: { email: string }) {
    try {
      await this.emailService.sendPasswordResetEmail(
        body.email,
        'test-token-123',
        'Test User',
      );
      return { message: 'Test email sent successfully' };
    } catch (error) {
      return {
        error: 'Failed to send test email',
        details: error.message,
      };
    }
  }

  @Post('test-welcome')
  async testWelcomeEmail(@Body() body: { email: string; username?: string }) {
    try {
      await this.emailService.sendWelcomeEmail(
        body.email,
        body.username || 'Test User',
      );
      return { message: 'Welcome email sent successfully' };
    } catch (error) {
      return {
        error: 'Failed to send welcome email',
        details: error.message,
      };
    }
  }

  @Get('config')
  getEmailConfig() {
    return {
      message: 'Email service is configured with Resend',
      provider: 'Resend',
      timestamp: new Date().toISOString(),
    };
  }
}
