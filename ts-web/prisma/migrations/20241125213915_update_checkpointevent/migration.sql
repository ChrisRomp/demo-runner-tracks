/*
  Warnings:

  - A unique constraint covering the columns `[raceId,bibNumber]` on the table `RaceResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `raceId` to the `CheckpointEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RaceResult_raceId_runnerId_bibNumber_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckpointEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventTime" DATETIME NOT NULL,
    "checkpointId" INTEGER NOT NULL,
    "raceId" INTEGER NOT NULL,
    "bibNumber" INTEGER NOT NULL,
    CONSTRAINT "CheckpointEvent_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CheckpointEvent_raceId_bibNumber_fkey" FOREIGN KEY ("raceId", "bibNumber") REFERENCES "RaceResult" ("raceId", "bibNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CheckpointEvent" ("bibNumber", "checkpointId", "eventTime", "id") SELECT "bibNumber", "checkpointId", "eventTime", "id" FROM "CheckpointEvent";
DROP TABLE "CheckpointEvent";
ALTER TABLE "new_CheckpointEvent" RENAME TO "CheckpointEvent";
CREATE UNIQUE INDEX "CheckpointEvent_checkpointId_raceId_bibNumber_key" ON "CheckpointEvent"("checkpointId", "raceId", "bibNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "RaceResult_raceId_bibNumber_key" ON "RaceResult"("raceId", "bibNumber");
