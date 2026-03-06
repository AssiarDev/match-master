-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL,
    "sport_id" INTEGER,
    "country_id" INTEGER,
    "nationality_id" INTEGER,
    "city_id" INTEGER,
    "position_id" INTEGER,
    "detailed_position_id" INTEGER,
    "type_id" INTEGER,
    "common_name" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "image_path" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "data_of_birth" TIMESTAMP(3),
    "gender" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Squad" (
    "id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "has_values" BOOLEAN,
    "position_id" INTEGER,
    "jersey_number" INTEGER,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" INTEGER NOT NULL,
    "sport_id" INTEGER,
    "league_id" INTEGER,
    "tie_breaker_rule_id" INTEGER,
    "name" TEXT,
    "finished" BOOLEAN,
    "pending" BOOLEAN,
    "is_current" BOOLEAN,
    "starting_at" TIMESTAMP(3),
    "ending_at" TIMESTAMP(3),
    "games_in_current_week" BOOLEAN,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
