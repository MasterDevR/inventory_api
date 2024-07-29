/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `admininformation` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `departmentinformation` table. All the data in the column will be lost.
  - You are about to drop the column `fund` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `preOrderPrint` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `stockinformation` table. All the data in the column will be lost.
  - You are about to drop the column `unitOfmeasurement` on the `stockinformation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reOrderPoint]` on the table `stockInformation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `consumeDate` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distributor` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurement` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reOrderPoint` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `stockInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `src` to the `stockInformation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `requestinformation` DROP FOREIGN KEY `requestInformation_stockNo_fkey`;

-- DropIndex
DROP INDEX `stockInformation_preOrderPrint_key` ON `stockinformation`;

-- AlterTable
ALTER TABLE `admininformation` DROP COLUMN `refreshToken`,
    ADD COLUMN `department` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE `departmentinformation` DROP COLUMN `refreshToken`;

-- AlterTable
ALTER TABLE `stockinformation` DROP COLUMN `fund`,
    DROP COLUMN `preOrderPrint`,
    DROP COLUMN `supplier`,
    DROP COLUMN `unitOfmeasurement`,
    ADD COLUMN `consumeDate` INTEGER NOT NULL,
    ADD COLUMN `createdBy` VARCHAR(191) NOT NULL,
    ADD COLUMN `distributor` VARCHAR(191) NOT NULL,
    ADD COLUMN `measurement` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL,
    ADD COLUMN `reOrderPoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL,
    ADD COLUMN `src` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `stockInformation_reOrderPoint_key` ON `stockInformation`(`reOrderPoint`);

-- AddForeignKey
ALTER TABLE `stockInformation` ADD CONSTRAINT `stockInformation_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `adminInformation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
