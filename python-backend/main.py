from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import leaguepedia_parser
from typing import List, Optional
import logging

app = FastAPI(title="League Custom Tracker API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def root():
    return {"message": "League Custom Tracker API is running"}

@app.get("/regions")
async def get_regions():
    """Get all available regions from Leaguepedia"""
    try:
        regions = leaguepedia_parser.get_regions()
        return {"regions": regions}
    except Exception as e:
        logger.error(f"Error fetching regions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch regions: {str(e)}")

@app.get("/tournaments/{region}")
async def get_tournaments(region: str, year: Optional[int] = None):
    """Get tournaments for a specific region and optional year"""
    try:
        if year:
            tournaments = leaguepedia_parser.get_tournaments(region, year=year)
        else:
            tournaments = leaguepedia_parser.get_tournaments(region)
        return {"region": region, "year": year, "tournaments": tournaments}
    except Exception as e:
        logger.error(f"Error fetching tournaments for {region}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch tournaments: {str(e)}")

@app.get("/games/{tournament}")
async def get_games(tournament: str):
    """Get all games for a specific tournament"""
    try:
        games = leaguepedia_parser.get_games(tournament)
        return {"tournament": tournament, "games": games}
    except Exception as e:
        logger.error(f"Error fetching games for {tournament}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch games: {str(e)}")

@app.get("/game-details")
async def get_game_details(game_id: str):
    """Get detailed information for a specific game"""
    try:
        # Note: This assumes game_id can be used to fetch game details
        # You may need to adjust this based on the actual leaguepedia_parser API
        game_details = leaguepedia_parser.get_game_details({"gameid": game_id})
        return {"game_id": game_id, "details": game_details}
    except Exception as e:
        logger.error(f"Error fetching game details for {game_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch game details: {str(e)}")

@app.get("/team-logo/{team_name}")
async def get_team_logo(team_name: str):
    """Get the logo URL for a specific team"""
    try:
        logo_url = leaguepedia_parser.get_team_logo(team_name)
        return {"team_name": team_name, "logo_url": logo_url}
    except Exception as e:
        logger.error(f"Error fetching logo for {team_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch team logo: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 