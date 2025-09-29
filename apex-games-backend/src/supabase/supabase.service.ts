
import { 
  Injectable, 
  InternalServerErrorException,
  Logger,
  OnModuleInit 
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  private readonly supabaseUrl: string;
  private readonly supabaseKey: string;

  constructor(private configService: ConfigService) {
     // 1. Récupération et vérification immédiate des clés
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');
    
    if (!url || !key) {
        throw new InternalServerErrorException(
            'Configuration Supabase manquante : SUPABASE_URL ou SUPABASE_KEY non défini.',
        );
    }
    
    this.supabaseUrl = url;
    this.supabaseKey = key;

    //Initialisation du client 
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
    this.logger.log('Client Supabase initialisé (non connecté).');
  }

  /********************Test de Connexion ********************************/
  async onModuleInit() {
    this.logger.log('Test de connexion à Supabase en cours...');
    
    try {
      // récupérer des infos sur une table
      const { error } = await this.supabaseClient
        .from('Test') 
        .select('id')
        .limit(1)
        .single();
        
      // PGRST116 = Aucune ligne trouvée 
      if (error && error.code !== 'PGRST116') { 
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      this.logger.log('✅ Connexion à Supabase réussie, bien joué BG :)');
      
    } catch (e) {
      this.logger.error('❌ ÉCHEC DE LA CONNEXION :(', e instanceof Error ? e.stack : e);
    }
  }

  /**
   * Méthode pour obtenir le client Supabase dans les autres services.
   * Exemple : this.supabaseService.client.from('ma_table').select('*')
   */
  get client(): SupabaseClient {
    return this.supabaseClient;
  }
}