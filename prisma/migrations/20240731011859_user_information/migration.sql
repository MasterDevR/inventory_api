/*
  Warnings:

  - You are about to drop the `admininformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departmentinformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `request_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `request_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_information` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `request_details` DROP FOREIGN KEY `request_details_requesterId_fkey`;

-- DropForeignKey
ALTER TABLE `request_item` DROP FOREIGN KEY `request_item_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `request_item` DROP FOREIGN KEY `request_item_requisitionId_fkey`;

-- DropForeignKey
ALTER TABLE `requestinformation` DROP FOREIGN KEY `requestInformation_deptId_fkey`;

-- DropForeignKey
ALTER TABLE `stockinformation` DROP FOREIGN KEY `stockInformation_createdBy_fkey`;

-- DropTable
DROP TABLE `admininformation`;

-- DropTable
DROP TABLE `departmentinformation`;

-- DropTable
DROP TABLE `request_details`;

-- DropTable
DROP TABLE `request_item`;

-- DropTable
DROP TABLE `stock_information`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `userInformation` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `deptId` VARCHAR(191) NOT NULL,
    `role` ENUM('RECEIVER', 'APPROVER', 'DEPARTMENT') NOT NULL,
    `deptCode` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `userInformation_id_key`(`id`),
    UNIQUE INDEX `userInformation_deptId_key`(`deptId`),
    UNIQUE INDEX `userInformation_deptCode_key`(`deptCode`),
    UNIQUE INDEX `userInformation_department_key`(`department`),
    UNIQUE INDEX `userInformation_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `requestInformation` ADD CONSTRAINT `requestInformation_deptId_fkey` FOREIGN KEY (`deptId`) REFERENCES `userInformation`(`deptId`) ON DELETE RESTRICT ON UPDATE CASCADE;
