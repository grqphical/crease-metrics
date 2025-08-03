from fastapi import FastAPI, APIRouter
from typing import List
from pydantic import BaseModel
import aiohttp


class Name(BaseModel):
    default: str


class LeaderboardGoalie(BaseModel):
    id: int
    firstName: Name
    lastName: Name
    sweaterNumber: int
    headshot: str
    teamAbbrev: str
    teamLogo: str
    value: float


app = FastAPI()

api_router = APIRouter(prefix="/api")


@api_router.get("/leaderboard/wins", response_model=List[LeaderboardGoalie])
async def wins_leaderboard():
    async with aiohttp.ClientSession() as session:
        async with session.get(
            "https://api-web.nhle.com/v1/goalie-stats-leaders/current?limit=5"
        ) as response:
            json_data = await response.json()

            leaderboard = [LeaderboardGoalie(**item) for item in json_data["wins"]]
            return leaderboard


@api_router.get("/leaderboard/svpct", response_model=List[LeaderboardGoalie])
async def wins_leaderboard():
    async with aiohttp.ClientSession() as session:
        async with session.get(
            "https://api-web.nhle.com/v1/goalie-stats-leaders/current?limit=5"
        ) as response:
            json_data = await response.json()

            leaderboard = [LeaderboardGoalie(**item) for item in json_data["savePctg"]]
            return leaderboard


app.include_router(api_router)
