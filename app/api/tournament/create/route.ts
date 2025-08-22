import { NextRequest, NextResponse } from 'next/server';
import { RIOT_API_CONFIG, validateRiotApiConfig } from '@/app/utils/riot-api-config';

export async function POST(request: NextRequest) {
  try {
    // Validate environment configuration
    const { isValid, errors } = validateRiotApiConfig();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Configuration error', details: errors },
        { status: 500 }
      );
    }

    const { name, providerId, region } = await request.json();

    if (!name || !providerId || !region) {
      return NextResponse.json(
        { error: 'Name, providerId, and region are required' },
        { status: 400 }
      );
    }

    // Validate region
    const regionUrl = RIOT_API_CONFIG.REGIONS[region as keyof typeof RIOT_API_CONFIG.REGIONS];
    if (!regionUrl) {
      return NextResponse.json(
        { error: 'Invalid region' },
        { status: 400 }
      );
    }

    // Create tournament with Riot API
    const tournamentData = {
      name,
      providerId: Number(providerId)
    };

    const response = await fetch(
      `${regionUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_TOURNAMENT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Riot-Token': process.env.RIOT_API_KEY!
        },
        body: JSON.stringify(tournamentData)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Riot API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create tournament with Riot API', details: errorData },
        { status: response.status }
      );
    }

    const tournamentId = await response.json();

    return NextResponse.json({
      tournamentId,
      name,
      providerId: Number(providerId),
      region
    });

  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 