import { NextRequest, NextResponse } from 'next/server';

// Tournament event types based on Riot API documentation
interface TournamentCallback {
  eventType: string;
  tournamentCode: string;
  gameId: number;
  platformId: string;
  timestamp: number;
  participants?: {
    summonerId: string;
    teamId: number;
    spell1Id: number;
    spell2Id: number;
    championId: number;
    profileIconId: number;
    summonerName: string;
  }[];
  gameData?: {
    gameId: number;
    gameCreation: number;
    gameDuration: number;
    queueId: number;
    mapId: number;
    seasonId: number;
    gameVersion: string;
    gameMode: string;
    gameType: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const body: TournamentCallback = await request.json();
    
    // Validate required fields
    if (!body.eventType || !body.tournamentCode || !body.platformId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the callback for debugging (remove in production)
    console.log('Tournament callback received:', {
      eventType: body.eventType,
      tournamentCode: body.tournamentCode,
      gameId: body.gameId,
      platformId: body.platformId,
      timestamp: body.timestamp
    });

    // Handle different event types
    switch (body.eventType) {
      case 'gameCreated':
        await handleGameCreated(body);
        break;
      case 'gameCompleted':
        await handleGameCompleted(body);
        break;
      case 'tournamentStarted':
        await handleTournamentStarted(body);
        break;
      case 'tournamentCompleted':
        await handleTournamentCompleted(body);
        break;
      default:
        console.warn(`Unknown event type: ${body.eventType}`);
    }

    // Respond with success status
    return NextResponse.json(
      { success: true, message: 'Callback processed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing tournament callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Event handlers
async function handleGameCreated(data: TournamentCallback) {
  // TODO: Implement game creation logic
  // - Store game information in database
  // - Notify relevant users
  // - Set up game monitoring
  console.log('Game created:', data.gameId);
}

async function handleGameCompleted(data: TournamentCallback) {
  // TODO: Implement game completion logic
  // - Fetch final game results
  // - Update tournament standings
  // - Calculate statistics
  console.log('Game completed:', data.gameId);
}

async function handleTournamentStarted(data: TournamentCallback) {
  // TODO: Implement tournament start logic
  // - Initialize tournament tracking
  // - Send notifications to participants
  console.log('Tournament started:', data.tournamentCode);
}

async function handleTournamentCompleted(data: TournamentCallback) {
  // TODO: Implement tournament completion logic
  // - Finalize results
  // - Generate reports
  // - Distribute rewards
  console.log('Tournament completed:', data.tournamentCode);
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 