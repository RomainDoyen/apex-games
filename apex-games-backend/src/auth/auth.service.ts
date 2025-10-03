import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, User, JwtPayload } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const client = this.supabaseService.client;

    // Vérifier si l'email existe déjà
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('email', registerDto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('Un compte avec cet email existe déjà');
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const { data: existingUsername } = await client
      .from('users')
      .select('id')
      .eq('username', registerDto.username)
      .single();

    if (existingUsername) {
      throw new ConflictException("Ce nom d'utilisateur est déjà pris");
    }

    // Hasher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Créer l'utilisateur
    const { data: newUser, error } = await client
      .from('users')
      .insert({
        username: registerDto.username,
        email: registerDto.email,
        password_hash: hashedPassword,
        role: 'user', // Rôle par défaut
      })
      .select('id, username, email, role, created_at, updated_at')
      .single();

    if (error) {
      this.logger.error(
        "Erreur lors de la création de l'utilisateur:",
        error.message,
      );
      throw new Error('Erreur lors de la création du compte');
    }

    // Générer le token JWT
    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    };

    this.logger.log(
      `Nouvel utilisateur créé: ${newUser.username} (${newUser.email})`,
    );

    // Envoyer l'email de bienvenue (en arrière-plan, ne pas faire échouer l'inscription)
    this.emailService.sendWelcomeEmail(newUser.email, newUser.username).catch(error => {
      this.logger.error('Failed to send welcome email:', error);
    });

    // Ne pas connecter automatiquement l'utilisateur après inscription
    return {
      message: 'Inscription réussie. Vous pouvez maintenant vous connecter.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer le token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = 6 * 60 * 60; // 6 heures en secondes

    this.logger.log(`Connexion réussie: ${user.username} (${user.email})`);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      access_token,
      expires_in,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      // Vérifier si l'utilisateur existe
      const { data: user, error } = await this.supabaseService.client
        .from('users')
        .select('id, email, username')
        .eq('email', email)
        .single();

      if (error || !user) {
        // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
        return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
      }

      // Générer un token de réinitialisation (expire dans 1 heure)
      const resetToken = this.jwtService.sign(
        { sub: user.id, type: 'password_reset' },
        { expiresIn: '1h' }
      );

      // Envoyer l'email avec le lien de réinitialisation
      await this.emailService.sendPasswordResetEmail(email, resetToken, user.username);

      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
    } catch (error) {
      this.logger.error('Error in forgotPassword:', error);
      throw new BadRequestException('Erreur lors de la demande de réinitialisation');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      // Vérifier le token
      const payload = this.jwtService.verify(token);
      
      if (payload.type !== 'password_reset') {
        throw new UnauthorizedException('Token invalide');
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Mettre à jour le mot de passe
      const { error } = await this.supabaseService.client
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', payload.sub);

      if (error) {
        throw new BadRequestException('Erreur lors de la mise à jour du mot de passe');
      }

      return { message: 'Mot de passe mis à jour avec succès' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Error in resetPassword:', error);
      throw new BadRequestException('Token invalide ou expiré');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const client = this.supabaseService.client;

    const { data: user, error } = await client
      .from('users')
      .select('id, username, email, role, password_hash, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    // Retourner l'utilisateur sans le hash du mot de passe
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async validateUserById(userId: string): Promise<User | null> {
    const client = this.supabaseService.client;

    const { data: user, error } = await client
      .from('users')
      .select('id, username, email, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return null;
    }

    return user as User;
  }

  logout(): { message: string } {
    // Avec JWT, la déconnexion se fait côté client en supprimant le token
    // Ici on pourrait ajouter une blacklist de tokens si nécessaire
    return { message: 'Déconnexion réussie' };
  }
}
