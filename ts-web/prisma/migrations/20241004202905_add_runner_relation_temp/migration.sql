/*
  Warnings:

  - Made the column `userId` on table `Runner` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Runner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Runner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Runner" ("age", "id", "name", "userId") SELECT "age", "id", "name", "userId" FROM "Runner";
DROP TABLE "Runner";
ALTER TABLE "new_Runner" RENAME TO "Runner";
CREATE UNIQUE INDEX "Runner_userId_key" ON "Runner"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
