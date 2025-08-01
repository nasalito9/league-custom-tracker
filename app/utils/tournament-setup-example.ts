// Example: How to register your provider with Riot's Tournament API
// This is a reference implementation - actual registration should be done server-side

import { 
  RIOT_API_CONFIG, 
  getCallbackUrl, 
  ProviderRegistration, 
  TournamentRegistration,
  TournamentCodeRequest 
} from './riot-api-config';

// Step 1: Register as a tournament provider
export async function registerTournamentProvider(
  apiKey: string, 
  region: keyof typeof RIOT_API_CONFIG.REGIONS,
  callbackUrl?: string
): Promise<number> {
  const baseUrl = RIOT_API_CONFIG.REGIONS[region];
  const endpoint = RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_PROVIDER;
  
  const providerData: ProviderRegistration = {
    region: region,
    url: callbackUrl || getCallbackUrl()
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': apiKey
    },
    body: JSON.stringify(providerData)
  });

  if (!response.ok) {
    throw new Error(`Failed to register provider: ${response.statusText}`);
  }

  const providerId = await response.json();
  console.log('Provider registered successfully. Provider ID:', providerId);
  return providerId;
}

// Step 2: Register a tournament
export async function registerTournament(
  apiKey: string,
  region: keyof typeof RIOT_API_CONFIG.REGIONS,
  providerId: number,
  tournamentName: string
): Promise<number> {
  const baseUrl = RIOT_API_CONFIG.REGIONS[region];
  const endpoint = RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_TOURNAMENT;
  
  const tournamentData: TournamentRegistration = {
    name: tournamentName,
    providerId: providerId
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': apiKey
    },
    body: JSON.stringify(tournamentData)
  });

  if (!response.ok) {
    throw new Error(`Failed to register tournament: ${response.statusText}`);
  }

  const tournamentId = await response.json();
  console.log('Tournament registered successfully. Tournament ID:', tournamentId);
  return tournamentId;
}

// Step 3: Create tournament codes
export async function createTournamentCodes(
  apiKey: string,
  region: keyof typeof RIOT_API_CONFIG.REGIONS,
  tournamentId: number,
  count: number,
  codeConfig: TournamentCodeRequest
): Promise<string[]> {
  const baseUrl = RIOT_API_CONFIG.REGIONS[region];
  const endpoint = `${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.CREATE_CODES}?tournamentId=${tournamentId}&count=${count}`;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Riot-Token': apiKey
    },
    body: JSON.stringify(codeConfig)
  });

  if (!response.ok) {
    throw new Error(`Failed to create tournament codes: ${response.statusText}`);
  }

  const codes = await response.json();
  console.log('Tournament codes created successfully:', codes);
  return codes;
}

// Complete setup example
export async function setupTournamentComplete(apiKey: string) {
  try {
    console.log('Starting tournament setup...');
    console.log('Callback URL:', getCallbackUrl());
    
    // 1. Register provider
    const providerId = await registerTournamentProvider(apiKey, 'AMERICAS');
    
    // 2. Register tournament
    const tournamentId = await registerTournament(
      apiKey, 
      'AMERICAS', 
      providerId, 
      'League Custom Tracker Tournament'
    );
    
    // 3. Create tournament codes
    const codes = await createTournamentCodes(
      apiKey,
      'AMERICAS',
      tournamentId,
      5, // Create 5 tournament codes
      {
        teamSize: 5,
        pickType: 'TOURNAMENT_DRAFT',
        mapType: 'SUMMONERS_RIFT',
        spectatorType: 'ALL',
        metadata: 'custom-tracker-tournament'
      }
    );
    
    return {
      providerId,
      tournamentId,
      codes,
      callbackUrl: getCallbackUrl()
    };
    
  } catch (error) {
    console.error('Tournament setup failed:', error);
    throw error;
  }
} 