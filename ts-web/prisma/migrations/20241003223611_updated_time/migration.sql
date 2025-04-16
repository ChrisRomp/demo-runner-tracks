/*
  Warnings:

  - You are about to drop the column `time` on the `RaceResult` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `RaceResult` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RaceResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "runnerId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "elapsedTime" DATETIME,
    CONSTRAINT "RaceResult_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RaceResult_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RaceResult" ("id", "raceId", "runnerId") SELECT "id", "raceId", "runnerId" FROM "RaceResult";
DROP TABLE "RaceResult";
ALTER TABLE "new_RaceResult" RENAME TO "RaceResult";
CREATE UNIQUE INDEX "RaceResult_raceId_runnerId_key" ON "RaceResult"("raceId", "runnerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
