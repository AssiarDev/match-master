-- CreateTable
CREATE TABLE "Competitions" (
    "id" INTEGER NOT NULL,
    "country_id" INTEGER,
    "name" TEXT NOT NULL,
    "short_code" TEXT,
    "image_path" TEXT,
    "type" TEXT NOT NULL,
    "sub_type" TEXT,

    CONSTRAINT "Competitions_pkey" PRIMARY KEY ("id")
);
