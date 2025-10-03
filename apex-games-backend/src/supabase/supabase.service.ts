import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public readonly client: SupabaseClient<any>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    // Utiliser la clé service_role pour contourner RLS
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error(
        'Configuration Supabase manquante. Vérifiez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY',
      );
      throw new Error('Configuration Supabase manquante');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Client Supabase initialisé avec succès (service_role)');
  }
}
