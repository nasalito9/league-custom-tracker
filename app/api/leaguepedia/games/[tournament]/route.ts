import { NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: { tournament: string } }
) {
  try {
    const response = await fetch(
      `${PYTHON_BACKEND_URL}/games/${encodeURIComponent(params.tournament)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Python backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games from Leaguepedia' },
      { status: 500 }
    );
  }
} 