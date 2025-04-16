-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "location" REAL NOT NULL,
    "bibNumber" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Checkpoint_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
