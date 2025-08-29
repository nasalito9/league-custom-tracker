# Leaguepedia Parser Integration Setup

This guide explains how to set up and use the `leaguepedia_parser` Python package within your Next.js League Custom Tracker application.

## Architecture Overview

The integration uses a **hybrid architecture**:
- **Python Backend**: FastAPI service running `leaguepedia_parser`
- **Next.js Frontend**: React/TypeScript application
- **API Bridge**: Next.js API routes that proxy requests to the Python backend

## Prerequisites

- **Python 3.8+** installed on your system
- **Node.js 18+** and npm/yarn
- Internet connection for accessing Leaguepedia data

## Quick Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies (including concurrently for running both servers)
npm install

# Install Python dependencies
npm run backend:install
```

### 2. Start Both Services

```bash
# Start both the Python backend (port 8000) and Next.js frontend (port 3000)
npm run dev:full
```

Or start them separately:

```bash
# Terminal 1: Start Python backend
npm run backend:start

# Terminal 2: Start Next.js frontend  
npm run dev
```

## Available API Endpoints

### Frontend API Routes (Next.js)
Access these from your React components:

- `GET /api/leaguepedia/regions` - Get all available regions
- `GET /api/leaguepedia/tournaments/[region]?year=2024` - Get tournaments for a region
- `GET /api/leaguepedia/games/[tournament]` - Get games for a tournament
- `GET /api/leaguepedia/team-logo/[team]` - Get team logo URL

### Backend API Routes (Python)
These run on `http://localhost:8000`:

- `GET /regions` - Raw leaguepedia regions data
- `GET /tournaments/{region}?year={year}` - Raw tournament data
- `GET /games/{tournament}` - Raw games data
- `GET /team-logo/{team_name}` - Raw team logo data

## Usage Examples

### React Component Example

```typescript
// components/RegionsList.tsx
import { useEffect, useState } from 'react';

export default function RegionsList() {
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaguepedia/regions')
      .then(res => res.json())
      .then(data => {
        setRegions(data.regions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching regions:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading regions...</div>;

  return (
    <div>
      <h2>Available Regions</h2>
      <ul>
        {regions.map(region => (
          <li key={region}>{region}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Fetch Tournament Data

```typescript
// Get tournaments for Korea in 2024
const response = await fetch('/api/leaguepedia/tournaments/Korea?year=2024');
const data = await response.json();
console.log(data.tournaments);
```

### Get Team Logo

```typescript
// Get T1 team logo
const response = await fetch('/api/leaguepedia/team-logo/T1');
const data = await response.json();
console.log(data.logo_url);
```

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Optional: Custom Python backend URL (defaults to http://localhost:8000)
PYTHON_BACKEND_URL=http://localhost:8000
```

### Python Backend Configuration

The Python backend automatically:
- Runs on `http://localhost:8000`
- Enables CORS for `http://localhost:3000`
- Provides automatic API documentation at `http://localhost:8000/docs`

## Troubleshooting

### Python Backend Won't Start

1. **Check Python Installation**:
   ```bash
   python3 --version  # Should be 3.8+
   ```

2. **Install Dependencies Manually**:
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Check Port Availability**:
   ```bash
   lsof -i :8000  # Kill any process using port 8000
   ```

### API Requests Failing

1. **Verify Backend is Running**:
   Visit `http://localhost:8000` - should show API status

2. **Check Network Connectivity**:
   The `leaguepedia_parser` needs internet access to fetch data

3. **Review Logs**:
   Check terminal output from the Python backend for error messages

### CORS Issues

If you see CORS errors, ensure:
- Python backend is running on port 8000
- Next.js frontend is running on port 3000
- No proxy or firewall is interfering

## Development

### Adding New Endpoints

1. **Add Python Route** in `python-backend/main.py`:
   ```python
   @app.get("/new-endpoint")
   async def new_endpoint():
       # Your leaguepedia_parser logic
       return {"data": "result"}
   ```

2. **Add Next.js Route** in `app/api/leaguepedia/new-endpoint/route.ts`:
   ```typescript
   export async function GET() {
     const response = await fetch(`${PYTHON_BACKEND_URL}/new-endpoint`);
     return NextResponse.json(await response.json());
   }
   ```

### Testing

- **Python Backend**: Visit `http://localhost:8000/docs` for interactive API docs
- **Next.js Routes**: Test at `http://localhost:3000/api/leaguepedia/*`

## Production Deployment

For production, you'll need to:

1. **Deploy Python Backend** to a service like:
   - Heroku
   - Railway
   - Google Cloud Run
   - AWS ECS

2. **Update Environment Variables**:
   ```env
   PYTHON_BACKEND_URL=https://your-python-backend.herokuapp.com
   ```

3. **Update CORS Settings** in `python-backend/main.py` to include your production domain

## Related Documentation

- [Leaguepedia Parser GitHub](https://github.com/mrtolkien/leaguepedia_parser)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) 