-- CreateTable
CREATE TABLE "Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Runner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "RaceResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    CONSTRAINT "RaceResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RaceResult_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RaceResult_raceId_runnerId_key" ON "RaceResult"("raceId", "runnerId");
