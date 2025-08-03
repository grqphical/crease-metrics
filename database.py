import sqlite3
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

conn = sqlite3.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()


def create_schema():
    cur.execute(
        """CREATE TABLE IF NOT EXISTS shots (
    arenaAdjustedXCord              REAL,
    arenaAdjustedYCord              REAL,
    shotDistance                    REAL,
    shotAngle                       REAL,
    shotRebound                     INTEGER,
    shotWasOnGoal                   INTEGER,
    shotRush                        INTEGER,
    shootingTeamDefencemenOnIce     INTEGER,
    shootingTeamForwardsOnIce       INTEGER,
    playerPositionThatDidEvent      TEXT,
    shooterLeftRight                TEXT,
    offWing                         INTEGER,
    shotType                        TEXT,
    defendingTeamDefencemenOnIce    INTEGER,
    defendingTeamForwardsOnIce      INTEGER,
    goal                            INTEGER
);"""
    )

    conn.commit()


def seed_database():
    cur.execute("SELECT EXISTS (SELECT 1 FROM shots LIMIT 1);")
    is_not_empty = cur.fetchone()[0]

    if is_not_empty == 1:
        return

    shots_df = pd.read_csv("data/shots_2007-2023.csv")

    shots_df = pd.read_csv("data/shots_2023.csv")
    shots_df = shots_df[shots_df["shotOnEmptyNet"] == 0]
    shots_df = shots_df[shots_df["event"] != "MISS"]

    position_mapping = {"C": 0, "L": 1, "R": 2, "D": 3}
    shots_df["playerPositionThatDidEvent"] = shots_df["playerPositionThatDidEvent"].map(
        position_mapping
    )

    wing_mapping = {"R": 0, "L": 1}
    shots_df["shooterLeftRight"] = shots_df["shooterLeftRight"].map(wing_mapping)

    shot_type_map = {
        "WRIST": 0,
        "SNAP": 1,
        "SLAP": 2,
        "BACK": 3,
        "TIP": 4,
        "DEFL": 5,
        "WRAP": 6,
    }
    shots_df["shotType"] = shots_df["shotType"].map(shot_type_map)

    shots_df = shots_df[
        [
            "arenaAdjustedXCord",
            "arenaAdjustedYCord",
            "shotDistance",
            "shotAngle",
            "shotRebound",
            "shotWasOnGoal",
            "shotRush",
            "shootingTeamDefencemenOnIce",
            "shootingTeamForwardsOnIce",
            "playerPositionThatDidEvent",
            "shooterLeftRight",
            "offWing",
            "shotType",
            "defendingTeamDefencemenOnIce",
            "defendingTeamForwardsOnIce",
            "goal",
        ]
    ]

    insert_query = """
    INSERT INTO shots (
        arenaAdjustedXCord, arenaAdjustedYCord, shotDistance, shotAngle,
        shotRebound, shotWasOnGoal, shotRush, shootingTeamDefencemenOnIce,
        shootingTeamForwardsOnIce, playerPositionThatDidEvent, shooterLeftRight, offWing,
        shotType, defendingTeamDefencemenOnIce, defendingTeamForwardsOnIce, goal
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """

    cur.executemany(insert_query, shots_df.values.tolist())

    conn.commit()


create_schema()
seed_database()
