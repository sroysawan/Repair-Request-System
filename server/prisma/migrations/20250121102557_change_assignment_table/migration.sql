/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `repairhistory` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `RepairHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assignment` DROP COLUMN `finishedAt`,
    DROP COLUMN `solution`,
    DROP COLUMN `startedAt`;

-- AlterTable
ALTER TABLE `repairhistory` DROP COLUMN `startedAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
