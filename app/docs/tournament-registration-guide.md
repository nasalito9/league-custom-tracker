# Tournament Provider Registration Guide

## Overview

This guide shows how to register your League Custom Tracker as a tournament provider with Riot Games using the [Tournament v5 API](https://developer.riotgames.com/apis#tournament-v5/POST_registerProviderData).

## Prerequisites

1. **Riot Developer Account** with Tournament API access
2. **Valid API Key** with tournament permissions
3. **Deployed Application** with publicly accessible callback URL

## Registration Process

### Step 1: Prepare Your Environment

Create a `.env.local` file with your configuration:

```bash
RIOT_API_KEY=your_actual_riot_api_key_here
NEXT_PUBLIC_BASE_URL=https://your-domain.com  # Production URL
# For development: NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 2: Register Provider (Manual Method)

#### Using cURL:

```bash
curl -X POST "https://americas.api.riotgames.com/lol/tournament/v5/providers" \
  -H "Content-Type: application/json" \
  -H "X-Riot-Token: YOUR_API_KEY" \
  -d '{
    "region": "AMERICAS",
    "url": "https://your-domain.com/api/tournament/callback"
  }'
```

#### Using our script:

```bash
# Set your API key
export RIOT_API_KEY="your_api_key_here"

# Run the registration script
npm run dev &  # Start your server first
npx tsx app/scripts/register-provider.ts
```

### Step 3: Expected Response

**Success Response (HTTP 200):**
```json
48  // Your unique Provider ID
```

**Error Responses:**
- `400 Bad Request`: Invalid payload or missing fields
- `401 Unauthorized`: Invalid API key
- `403 Forbidden`: API key lacks tournament permissions
- `415 Unsupported Media Type`: Missing Content-Type header

## Callback URL Requirements

Your callback URL (`/api/tournament/callback`) **must**:

✅ **Be publicly accessible** (not localhost for production)
✅ **Accept POST requests** with JSON payloads
✅ **Respond with HTTP 200** for successful processing
✅ **Handle SSL/HTTPS** for production environments

## Testing Your Setup

### 1. Verify Callback Endpoint

```bash
# Test status endpoint
curl https://your-domain.com/api/tournament/status

# Test callback with sample data
curl -X POST https://your-domain.com/api/tournament/callback \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "gameCreated",
    "tournamentCode": "TEST123",
    "gameId": 12345,
    "platformId": "NA1",
    "timestamp": 1640995200000
  }'
```

### 2. Verify Registration

After successful registration, your Provider ID will be used for:
- Creating tournament tournaments
- Generating tournament codes
- Receiving game events at your callback URL

## Event Flow After Registration

1. **You create tournaments** using your Provider ID
2. **Players join** using tournament codes
3. **Riot sends events** to your callback URL:
   - `gameCreated` - When a tournament game starts
   - `gameCompleted` - When a tournament game ends
   - `tournamentStarted` - When a tournament begins
   - `tournamentCompleted` - When a tournament finishes

## Regional Endpoints

Choose the correct region for your tournaments:

| Region | Endpoint | Platforms |
|--------|----------|-----------|
| AMERICAS | `https://americas.api.riotgames.com` | NA1, BR1, LA1, LA2, OC1 |
| EUROPE | `https://europe.api.riotgames.com` | EUW1, EUN1, TR1, RU |
| ASIA | `https://asia.api.riotgames.com` | KR, JP1 |

## Troubleshooting

### Common Issues:

**"Invalid callback URL"**
- Ensure URL is publicly accessible
- Verify HTTPS in production
- Check that endpoint returns 200 status

**"API Key invalid"** 
- Verify your API key has tournament permissions
- Check key isn't expired
- Ensure proper X-Riot-Token header format

**"Region mismatch"**
- Confirm region parameter matches your target platforms
- Use correct regional endpoint URL

### Debug Your Callback:

```bash
# Check if your callback is reachable
curl -I https://your-domain.com/api/tournament/callback

# Monitor your application logs for incoming events
tail -f your-app-logs.log
```

## Next Steps

After successful provider registration:

1. **Save your Provider ID** - you'll need it for all tournament operations
2. **Create tournaments** using `/lol/tournament/v5/tournaments`
3. **Generate tournament codes** using `/lol/tournament/v5/codes`
4. **Monitor events** in your callback endpoint logs

## Security Considerations

- **Validate incoming payloads** in your callback handler
- **Rate limit** your callback endpoint
- **Log events** for debugging and monitoring
- **Use HTTPS** for all production endpoints
- **Verify request signatures** if implementing authentication 