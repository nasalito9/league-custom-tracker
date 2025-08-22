import { NextRequest, NextResponse } from 'next/server';
import { RIOT_API_CONFIG, getCallbackUrl, validateRiotApiConfig } from '@/app/utils/riot-api-config';

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

    const { region } = await request.json();

    if (!region) {
      return NextResponse.json(
        { error: 'Region is required' },
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

    // Register provider with Riot API
    const providerData = {
      region,
      url: getCallbackUrl()
    };

    const response = await fetch(
      `${regionUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_PROVIDER}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Riot-Token': process.env.RIOT_API_KEY!
        },
        body: JSON.stringify(providerData)
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Riot API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to register provider with Riot API', details: errorData },
        { status: response.status }
      );
    }

    const providerId = await response.json();

    return NextResponse.json({
      providerId,
      region,
      callbackUrl: providerData.url
    });

  } catch (error) {
    console.error('Error registering provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 