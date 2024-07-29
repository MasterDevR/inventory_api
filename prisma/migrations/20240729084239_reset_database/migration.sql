/*
  Warnings:

  - You are about to drop the column `src` on the `stockinformation` table. All the data in the column will be lost.
  - Made the column `image` on table `stockinformation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `requestInformation_stockNo_fkey` ON `requestinformation`;

-- AlterTable
ALTER TABLE `stockinformation` DROP COLUMN `src`,
    MODIFY `image` VARCHAR(191) NOT NULL;
