// Complete Tournament Integration Example
// This demonstrates the full flow: Provider Registration → Tournament Creation → Event Handling

import { 
  getCallbackUrl,
  RIOT_API_CONFIG,
  ProviderRegistration,
  TournamentRegistration,
  TournamentCodeRequest
} from './riot-api-config';

/**
 * Complete tournament setup workflow
 * This integrates with the POST registerProviderData endpoint
 */
export class TournamentManager {
  private apiKey: string;
  private region: keyof typeof RIOT_API_CONFIG.REGIONS;
  private baseUrl: string;

  constructor(apiKey: string, region: keyof typeof RIOT_API_CONFIG.REGIONS = 'AMERICAS') {
    this.apiKey = apiKey;
    this.region = region;
    this.baseUrl = RIOT_API_CONFIG.REGIONS[region];
  }

  /**
   * Step 1: Register as Tournament Provider
   * Uses the POST registerProviderData endpoint from Riot's documentation
   */
  async registerProvider(customCallbackUrl?: string): Promise<number> {
    const callbackUrl = customCallbackUrl || getCallbackUrl();
    const endpoint = `${this.baseUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_PROVIDER}`;
    
    // Payload structure required by POST registerProviderData
    const providerPayload: ProviderRegistration = {
      region: this.region,
      url: callbackUrl
    };

    console.log(`🔗 Registering provider with callback: ${callbackUrl}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Riot-Token': this.apiKey
      },
      body: JSON.stringify(providerPayload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Provider registration failed: ${response.status} - ${error}`);
    }

    const providerId = await response.json();
    console.log(`✅ Provider registered! ID: ${providerId}`);
    return providerId;
  }

  /**
   * Step 2: Register Tournament
   */
  async registerTournament(providerId: number, tournamentName: string): Promise<number> {
    const endpoint = `${this.baseUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_TOURNAMENT}`;
    
    const tournamentPayload: TournamentRegistration = {
      name: tournamentName,
      providerId: providerId
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Riot-Token': this.apiKey
      },
      body: JSON.stringify(tournamentPayload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tournament registration failed: ${response.status} - ${error}`);
    }

    const tournamentId = await response.json();
    console.log(`🏆 Tournament registered! ID: ${tournamentId}`);
    return tournamentId;
  }

  /**
   * Step 3: Create Tournament Codes
   */
  async createTournamentCodes(
    tournamentId: number, 
    count: number,
    config: TournamentCodeRequest
  ): Promise<string[]> {
    const endpoint = `${this.baseUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.CREATE_CODES}?tournamentId=${tournamentId}&count=${count}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Riot-Token': this.apiKey
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Tournament code creation failed: ${response.status} - ${error}`);
    }

    const codes = await response.json();
    console.log(`🎫 Created ${codes.length} tournament codes`);
    return codes;
  }
}

/**
 * Example: Complete Tournament Setup
 * This shows how your callback URL integrates with Riot's registerProviderData
 */
export async function exampleCompleteSetup() {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    throw new Error('RIOT_API_KEY environment variable required');
  }

  const tournament = new TournamentManager(apiKey, 'AMERICAS');

  try {
    console.log('🚀 Starting complete tournament setup...');
    
    // Step 1: Register Provider (uses POST registerProviderData)
    console.log('\n📍 Step 1: Registering provider...');
    const providerId = await tournament.registerProvider();
    
    // Your callback URL is now registered with Riot
    console.log(`✅ Your callback URL is registered: ${getCallbackUrl()}`);

    // Step 2: Register Tournament
    console.log('\n📍 Step 2: Registering tournament...');
    const tournamentId = await tournament.registerTournament(
      providerId, 
      'League Custom Tracker Championship'
    );

    // Step 3: Create Tournament Codes
    console.log('\n📍 Step 3: Creating tournament codes...');
    const codes = await tournament.createTournamentCodes(tournamentId, 3, {
      teamSize: 5,
      pickType: 'TOURNAMENT_DRAFT',
      mapType: 'SUMMONERS_RIFT',
      spectatorType: 'ALL',
      metadata: JSON.stringify({
        tournamentName: 'League Custom Tracker Championship',
        organizerId: 'custom-tracker',
        createdAt: new Date().toISOString()
      })
    });

    console.log('\n🎉 Tournament setup complete!');
    console.log('Tournament Details:');
    console.log(`  Provider ID: ${providerId}`);
    console.log(`  Tournament ID: ${tournamentId}`);
    console.log(`  Tournament Codes: ${codes.join(', ')}`);
    console.log(`  Callback URL: ${getCallbackUrl()}`);
    
    console.log('\n📝 What happens next:');
    console.log('1. Share tournament codes with players');
    console.log('2. Players create custom games using these codes');
    console.log('3. Riot will send events to your callback URL:');
    console.log('   - POST /api/tournament/callback');
    console.log('4. Your app will receive and process these events');

    return {
      providerId,
      tournamentId,
      codes,
      callbackUrl: getCallbackUrl()
    };

  } catch (error) {
    console.error('❌ Tournament setup failed:', error);
    throw error;
  }
}

/**
 * Example: Testing Your Callback URL
 * This simulates what Riot will send to your endpoint
 */
export async function testCallbackUrl(baseUrl?: string) {
  const callbackUrl = `${baseUrl || getCallbackUrl()}`;
  
  console.log(`🧪 Testing callback URL: ${callbackUrl}`);

  // Sample event that Riot would send
  const sampleEvent = {
    eventType: 'gameCreated',
    tournamentCode: 'EXAMPLE-TOURNAMENT-CODE',
    gameId: 1234567890,
    platformId: 'NA1',
    timestamp: Date.now(),
    participants: [
      {
        summonerId: 'sample-summoner-id-1',
        teamId: 100,
        spell1Id: 4,
        spell2Id: 7,
        championId: 157,
        profileIconId: 1,
        summonerName: 'SamplePlayer1'
      }
    ]
  };

  try {
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleEvent)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Callback test successful:', result);
    } else {
      console.log(`❌ Callback test failed: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Callback URL unreachable:', error);
  }
} 