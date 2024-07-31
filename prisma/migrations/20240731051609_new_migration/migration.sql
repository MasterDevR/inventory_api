/*
  Warnings:

  - You are about to drop the column `fund` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `itemName` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `preOrderPrint` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `unitOfmeasurement` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the `admininformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departmentinformation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reOrderPoint]` on the table `stockInformation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `consumeDate` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateList` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distributor` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurement` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qtyList` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reOrderPoint` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `stockinformation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `requestinformation` DROP FOREIGN KEY `requestInformation_deptId_fkey`;

-- DropForeignKey
ALTER TABLE `requestinformation` DROP FOREIGN KEY `requestInformation_stockNo_fkey`;

-- DropIndex
DROP INDEX `stockInformation_preOrderPrint_key` ON `stockinformation`;

-- AlterTable
ALTER TABLE `stockinformation` DROP COLUMN `fund`,
    DROP COLUMN `itemName`,
    DROP COLUMN `preOrderPrint`,
    DROP COLUMN `supplier`,
    DROP COLUMN `unitOfmeasurement`,
    ADD COLUMN `consumeDate` INTEGER NOT NULL,
    ADD COLUMN `dateList` JSON NOT NULL,
    ADD COLUMN `distributor` VARCHAR(191) NOT NULL,
    ADD COLUMN `item` VARCHAR(191) NOT NULL,
    ADD COLUMN `measurement` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL,
    ADD COLUMN `qtyList` JSON NOT NULL,
    ADD COLUMN `reOrderPoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL,
    ADD COLUMN `stockCounter` INTEGER NOT NULL DEFAULT 0,
    MODIFY `image` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `admininformation`;

-- DropTable
DROP TABLE `departmentinformation`;

-- CreateTable
CREATE TABLE `userInformation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX `stockInformation_reOrderPoint_key` ON `stockInformation`(`reOrderPoint`);

-- AddForeignKey
ALTER TABLE `requestInformation` ADD CONSTRAINT `requestInformation_deptId_fkey` FOREIGN KEY (`deptId`) REFERENCES `userInformation`(`deptId`) ON DELETE RESTRICT ON UPDATE CASCADE;
