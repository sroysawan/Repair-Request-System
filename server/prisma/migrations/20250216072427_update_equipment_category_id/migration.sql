/*
  Warnings:

  - Made the column `equipmentCategoryId` on table `equipment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `equipment` DROP FOREIGN KEY `Equipment_equipmentCategoryId_fkey`;

-- DropIndex
DROP INDEX `Equipment_equipmentCategoryId_fkey` ON `equipment`;

-- AlterTable
ALTER TABLE `equipment` MODIFY `equipmentCategoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_equipmentCategoryId_fkey` FOREIGN KEY (`equipmentCategoryId`) REFERENCES `EquipmentCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
