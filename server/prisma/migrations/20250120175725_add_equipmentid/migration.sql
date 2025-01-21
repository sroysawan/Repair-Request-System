/*
  Warnings:

  - You are about to drop the column `equipmentCategoryId` on the `reportrepair` table. All the data in the column will be lost.
  - Added the required column `equipmentId` to the `ReportRepair` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reportrepair` DROP FOREIGN KEY `ReportRepair_equipmentCategoryId_fkey`;

-- DropIndex
DROP INDEX `ReportRepair_equipmentCategoryId_fkey` ON `reportrepair`;

-- AlterTable
ALTER TABLE `reportrepair` DROP COLUMN `equipmentCategoryId`,
    ADD COLUMN `equipmentId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ReportRepair` ADD CONSTRAINT `ReportRepair_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
