import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'League Custom Tracker - Tournament API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      callback: '/api/tournament/callback',
      status: '/api/tournament/status'
    }
  });
} 