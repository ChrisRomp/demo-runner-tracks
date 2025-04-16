/*
  Warnings:

  - Made the column `bibNumber` on table `RaceResult` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RaceResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bibNumber" INTEGER NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "elapsedTimeInSeconds" INTEGER,
    "runnerAge" INTEGER,
    "runnerName" TEXT,
    "raceId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    CONSTRAINT "RaceResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RaceResult_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RaceResult" ("bibNumber", "elapsedTimeInSeconds", "endTime", "id", "raceId", "runnerAge", "runnerId", "runnerName", "startTime") SELECT "bibNumber", "elapsedTimeInSeconds", "endTime", "id", "raceId", "runnerAge", "runnerId", "runnerName", "startTime" FROM "RaceResult";
DROP TABLE "RaceResult";
ALTER TABLE "new_RaceResult" RENAME TO "RaceResult";
CREATE UNIQUE INDEX "RaceResult_raceId_runnerId_bibNumber_key" ON "RaceResult"("raceId", "runnerId", "bibNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
