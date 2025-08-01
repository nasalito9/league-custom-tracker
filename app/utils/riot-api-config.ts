// Riot API Configuration for Tournament v5
export const RIOT_API_CONFIG = {
  // Base URLs for different regions
  REGIONS: {
    AMERICAS: 'https://americas.api.riotgames.com',
    EUROPE: 'https://europe.api.riotgames.com',
    ASIA: 'https://asia.api.riotgames.com',
  },
  
  // Tournament API endpoints
  TOURNAMENT_ENDPOINTS: {
    REGISTER_PROVIDER: '/lol/tournament/v5/providers',
    REGISTER_TOURNAMENT: '/lol/tournament/v5/tournaments',
    CREATE_CODES: '/lol/tournament/v5/codes',
  },
  
  // Platform IDs
  PLATFORMS: {
    BR1: 'BR1',
    EUN1: 'EUN1', 
    EUW1: 'EUW1',
    JP1: 'JP1',
    KR: 'KR',
    LA1: 'LA1',
    LA2: 'LA2',
    NA1: 'NA1',
    OC1: 'OC1',
    TR1: 'TR1',
    RU: 'RU',
  }
};

// Get the callback URL for your application
export function getCallbackUrl(baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${base}/api/tournament/callback`;
}

// Provider registration payload structure
export interface ProviderRegistration {
  region: string;
  url: string; // Your callback URL
}

// Tournament registration payload structure  
export interface TournamentRegistration {
  name: string;
  providerId: number;
}

// Tournament code creation payload structure
export interface TournamentCodeRequest {
  allowedSummonerIds?: string[];
  metadata?: string;
  teamSize: number;
  pickType: 'BLIND_PICK' | 'DRAFT_MODE' | 'ALL_RANDOM' | 'TOURNAMENT_DRAFT';
  mapType: 'SUMMONERS_RIFT' | 'TWISTED_TREELINE' | 'HOWLING_ABYSS';
  spectatorType: 'NONE' | 'LOBBYONLY' | 'ALL';
}

// Helper function to validate environment variables
export function validateRiotApiConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.RIOT_API_KEY) {
    errors.push('RIOT_API_KEY environment variable is required');
  }
  
  if (!process.env.NEXT_PUBLIC_BASE_URL && process.env.NODE_ENV === 'production') {
    errors.push('NEXT_PUBLIC_BASE_URL should be set for production');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 