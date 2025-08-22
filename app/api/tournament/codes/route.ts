import { NextRequest, NextResponse } from 'next/server';
import { RIOT_API_CONFIG, validateRiotApiConfig, TournamentCodeRequest } from '@/app/utils/riot-api-config';

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

    const { 
      tournamentId, 
      region, 
      count = 1,
      teamSize = 5,
      pickType = 'BLIND_PICK',
      mapType = 'SUMMONERS_RIFT',
      spectatorType = 'ALL',
      metadata = '',
      allowedSummonerIds = []
    } = await request.json();

    if (!tournamentId || !region) {
      return NextResponse.json(
        { error: 'Tournament ID and region are required' },
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

    // Validate count
    if (count < 1 || count > 1000) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 1000' },
        { status: 400 }
      );
    }

    // Create tournament codes request
    const codeRequest: TournamentCodeRequest = {
      teamSize,
      pickType: pickType as TournamentCodeRequest['pickType'],
      mapType: mapType as TournamentCodeRequest['mapType'],
      spectatorType: spectatorType as TournamentCodeRequest['spectatorType'],
      ...(metadata && { metadata }),
      ...(allowedSummonerIds.length > 0 && { allowedSummonerIds })
    };

    const response = await fetch(
      `${regionUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.CREATE_CODES}?tournamentId=${tournamentId}&count=${count}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Riot-Token': process.env.RIOT_API_KEY!
        },
        body: JSON.stringify(codeRequest)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Riot API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate tournament codes with Riot API', details: errorData },
        { status: response.status }
      );
    }

    const tournamentCodes = await response.json();

    return NextResponse.json({
      tournamentCodes,
      tournamentId: Number(tournamentId),
      count,
      settings: codeRequest
    });

  } catch (error) {
    console.error('Error generating tournament codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 