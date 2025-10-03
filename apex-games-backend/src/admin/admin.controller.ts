import { Controller, Get, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../auth/interfaces/auth.interface';

@Controller('admin')
@UseGuards(ThrottlerGuard, JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('admin')
  getDashboard(@CurrentUser() user: User) {
    return {
      message: `Bienvenue sur le tableau de bord admin, ${user.username}!`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      stats: {
        totalUsers: 0, // À implémenter
        totalGames: 0, // À implémenter
        totalBacklogs: 0, // À implémenter
      },
    };
  }

  @Get('users')
  @Roles('admin')
  getAllUsers(@CurrentUser() user: User) {
    return {
      message: 'Liste de tous les utilisateurs',
      admin: user.username,
      users: [], // À implémenter avec le service
    };
  }

  @Get('moderation')
  @Roles('admin', 'moderator')
  getModerationPanel(@CurrentUser() user: User) {
    return {
      message: `Panel de modération accessible à ${user.role}`,
      user: user.username,
      reports: [], // À implémenter
    };
  }
}
