/*
  Warnings:

  - You are about to drop the column `bibNumber` on the `Checkpoint` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Checkpoint` table. All the data in the column will be lost.
  - Added the required column `description` to the `Checkpoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RaceResult" ADD COLUMN "bibNumber" INTEGER;

-- CreateTable
CREATE TABLE "CheckpointEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventTime" DATETIME NOT NULL,
    "checkpointId" INTEGER NOT NULL,
    "bibNumber" INTEGER NOT NULL,
    CONSTRAINT "CheckpointEvent_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CheckpointEvent_bibNumber_fkey" FOREIGN KEY ("bibNumber") REFERENCES "RaceResult" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Checkpoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "raceId" INTEGER NOT NULL,
    CONSTRAINT "Checkpoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Checkpoint" ("id", "location", "raceId") SELECT "id", "location", "raceId" FROM "Checkpoint";
DROP TABLE "Checkpoint";
ALTER TABLE "new_Checkpoint" RENAME TO "Checkpoint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
