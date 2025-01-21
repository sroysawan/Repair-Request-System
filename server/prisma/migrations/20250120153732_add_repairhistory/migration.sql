/*
  Warnings:

  - Added the required column `reporterByUserId` to the `ReportRepair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reportrepair` ADD COLUMN `reporterByUserId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `RepairHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportRepairId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `reporterId` INTEGER NOT NULL,
    `reporterUserId` INTEGER NOT NULL,
    `technicianId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `solution` VARCHAR(191) NULL,
    `assignedAt` DATETIME(3) NOT NULL,
    `startedAt` DATETIME(3) NULL,
    `finishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReportRepair` ADD CONSTRAINT `ReportRepair_reporterByUserId_fkey` FOREIGN KEY (`reporterByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairHistory` ADD CONSTRAINT `RepairHistory_reportRepairId_fkey` FOREIGN KEY (`reportRepairId`) REFERENCES `ReportRepair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairHistory` ADD CONSTRAINT `RepairHistory_reporterUserId_fkey` FOREIGN KEY (`reporterUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairHistory` ADD CONSTRAINT `RepairHistory_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
