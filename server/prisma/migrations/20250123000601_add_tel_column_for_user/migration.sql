/*
  Warnings:

  - Added the required column `tel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `tel` INTEGER NOT NULL;
