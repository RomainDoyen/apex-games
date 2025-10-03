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
        'Test User'
      );
      return { message: 'Test email sent successfully' };
    } catch (error) {
      return { 
        error: 'Failed to send test email',
        details: error.message 
      };
    }
  }

  @Get('config')
  getEmailConfig() {
    return {
      message: 'Email service is configured',
      timestamp: new Date().toISOString()
    };
  }
}
