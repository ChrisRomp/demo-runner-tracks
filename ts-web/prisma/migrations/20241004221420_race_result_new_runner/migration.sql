-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RaceResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "elapsedTimeInSeconds" INTEGER,
    CONSTRAINT "RaceResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RaceResult_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RaceResult" ("elapsedTimeInSeconds", "endTime", "id", "raceId", "runnerId", "startTime") SELECT "elapsedTimeInSeconds", "endTime", "id", "raceId", "runnerId", "startTime" FROM "RaceResult";
DROP TABLE "RaceResult";
ALTER TABLE "new_RaceResult" RENAME TO "RaceResult";
CREATE UNIQUE INDEX "RaceResult_raceId_runnerId_key" ON "RaceResult"("raceId", "runnerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
