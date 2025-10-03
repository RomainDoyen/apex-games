import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const smtpConfig = {
      host: this.configService.get<string>('SMTP_HOST') || 'smtp-relay.brevo.com',
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    };

    this.logger.log('SMTP Configuration:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      pass: smtpConfig.auth.pass ? '***' : 'NOT_SET'
    });

    this.transporter = nodemailer.createTransport(smtpConfig);
  }

  async sendPasswordResetEmail(email: string, resetToken: string, username: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Apex Games" <${this.configService.get<string>('SMTP_FROM') || 'noreply@apexgames.com'}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Apex Games',
      html: this.getPasswordResetTemplate(username, resetUrl),
    };

    try {
      this.logger.log(`Attempting to send password reset email to ${email}`);
      this.logger.log('Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasHtml: !!mailOptions.html
      });

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent successfully to ${email}`, result);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      this.logger.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response
      });
      throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
  }

  private getPasswordResetTemplate(username: string, resetUrl: string): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #666;
                line-height: 1.8;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.2s ease;
            }
            .button:hover {
                transform: translateY(-2px);
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎮 APEX GAMES</div>
                <h1>Réinitialisation de mot de passe</h1>
            </div>
            
            <div class="content">
                <div class="greeting">Bonjour ${username},</div>
                
                <div class="message">
                    Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Apex Games.
                    Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                </div>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important :</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Ce lien expire dans <strong>1 heure</strong></li>
                        <li>Ne partagez jamais ce lien avec d'autres personnes</li>
                        <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                    </ul>
                </div>
                
                <div class="message">
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                    <a href="${resetUrl}" style="color: #646cff; word-break: break-all;">${resetUrl}</a>
                </div>
            </div>
            
            <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p>© 2024 Apex Games. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const mailOptions = {
      from: `"Apex Games" <${this.configService.get<string>('SMTP_FROM') || 'noreply@apexgames.com'}>`,
      to: email,
      subject: 'Bienvenue sur Apex Games !',
      html: this.getWelcomeTemplate(username),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      // Ne pas faire échouer l'inscription si l'email de bienvenue échoue
    }
  }

  private getWelcomeTemplate(username: string): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur Apex Games</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #666;
                line-height: 1.8;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
            }
            .features {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .features h3 {
                margin-top: 0;
                color: #333;
            }
            .features ul {
                margin: 0;
                padding-left: 20px;
            }
            .features li {
                margin-bottom: 8px;
                color: #666;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎮 APEX GAMES</div>
                <h1>Bienvenue ${username} !</h1>
            </div>
            
            <div class="content">
                <div class="greeting">Félicitations pour votre inscription !</div>
                
                <div class="message">
                    Votre compte Apex Games a été créé avec succès. Vous pouvez maintenant profiter de toutes nos fonctionnalités :
                </div>
                
                <div class="features">
                    <h3>🎯 Ce que vous pouvez faire :</h3>
                    <ul>
                        <li>📚 Créer et gérer votre backlog de jeux</li>
                        <li>🔍 Découvrir de nouveaux jeux</li>
                        <li>⭐ Suivre vos jeux favoris</li>
                        <li>📊 Visualiser vos statistiques de jeu</li>
                        <li>👥 Partager vos découvertes avec la communauté</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'}/games" class="button">Commencer à explorer</a>
                </div>
                
                <div class="message">
                    Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.
                    <br><br>
                    Bon gaming ! 🎮
                </div>
            </div>
            
            <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                <p>© 2024 Apex Games. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
