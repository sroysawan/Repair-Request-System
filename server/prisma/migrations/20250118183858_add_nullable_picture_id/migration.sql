/*
  Warnings:

  - You are about to drop the column `imageId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `equipment` DROP FOREIGN KEY `Equipment_equipmentCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `reportrepair` DROP FOREIGN KEY `ReportRepair_equipmentCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_imageId_fkey`;

-- DropIndex
DROP INDEX `Equipment_equipmentCategoryId_fkey` ON `equipment`;

-- DropIndex
DROP INDEX `ReportRepair_equipmentCategoryId_fkey` ON `reportrepair`;

-- DropIndex
DROP INDEX `User_imageId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `equipment` MODIFY `equipmentCategoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `reportRepairId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reportrepair` MODIFY `equipmentCategoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `imageId`,
    ADD COLUMN `pictureId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_pictureId_fkey` FOREIGN KEY (`pictureId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_equipmentCategoryId_fkey` FOREIGN KEY (`equipmentCategoryId`) REFERENCES `EquipmentCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportRepair` ADD CONSTRAINT `ReportRepair_equipmentCategoryId_fkey` FOREIGN KEY (`equipmentCategoryId`) REFERENCES `EquipmentCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
