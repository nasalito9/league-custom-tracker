import { NextResponse } from 'next/server';

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: Request,
  { params }: { params: { region: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    
    let url = `${PYTHON_BACKEND_URL}/tournaments/${encodeURIComponent(params.region)}`;
    if (year) {
      url += `?year=${year}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Python backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournaments from Leaguepedia' },
      { status: 500 }
    );
  }
} 