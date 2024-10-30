/*
  Warnings:

  - You are about to drop the column `quantity` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `stock_type` on the `stock` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `stock_history` table. All the data in the column will be lost.
  - You are about to drop the column `stock_id` on the `stock_history` table. All the data in the column will be lost.
  - You are about to drop the column `created_At` on the `stock_type` table. All the data in the column will be lost.
  - You are about to drop the column `consumeDate` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `distributor` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `item` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `measurement` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `reOrderPoint` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `stockNo` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_purpose` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `stock_type` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `transaction_purpose` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `transaction_status` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `purchase_order` to the `stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_type_id` to the `stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_order` to the `stock_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock_no` to the `stock_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_purpose_id` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `stock_stock_type_fkey`;

-- DropForeignKey
ALTER TABLE `stock_history` DROP FOREIGN KEY `stock_history_stock_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_status_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_transaction_purpose_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_role_fkey`;

-- DropIndex
DROP INDEX `stock_id_key` ON `stock`;

-- DropIndex
DROP INDEX `stock_re_order_point_key` ON `stock`;

-- DropIndex
DROP INDEX `stock_history_id_key` ON `stock_history`;

-- DropIndex
DROP INDEX `stock_type_id_key` ON `stock_type`;

-- DropIndex
DROP INDEX `transaction_id_key` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_purpose_id_key` ON `transaction_purpose`;

-- DropIndex
DROP INDEX `transaction_status_id_key` ON `transaction_status`;

-- DropIndex
DROP INDEX `user_department_code_key` ON `user`;

-- DropIndex
DROP INDEX `user_department_id_key` ON `user`;

-- DropIndex
DROP INDEX `user_department_key` ON `user`;

-- DropIndex
DROP INDEX `user_id_key` ON `user`;

-- AlterTable
ALTER TABLE `role` MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `stock` DROP COLUMN `quantity`,
    DROP COLUMN `stock_type`,
    ADD COLUMN `purchase_order` VARCHAR(191) NOT NULL,
    ADD COLUMN `purchase_request` VARCHAR(191) NULL,
    ADD COLUMN `quantity_issued` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `quantity_on_hand` INTEGER NULL,
    ADD COLUMN `stock_type_id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATE NOT NULL;

-- AlterTable
ALTER TABLE `stock_history` DROP COLUMN `quantity`,
    DROP COLUMN `stock_id`,
    ADD COLUMN `purchase_order` VARCHAR(191) NOT NULL,
    ADD COLUMN `purchase_request` VARCHAR(191) NULL,
    ADD COLUMN `quantity_issued` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `quantity_on_hand` INTEGER NULL,
    ADD COLUMN `stock_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_request` INTEGER NOT NULL DEFAULT 0,
    MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATE NOT NULL;

-- AlterTable
ALTER TABLE `stock_type` DROP COLUMN `created_At`,
    ADD COLUMN `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATE NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `consumeDate`,
    DROP COLUMN `description`,
    DROP COLUMN `distributor`,
    DROP COLUMN `image`,
    DROP COLUMN `item`,
    DROP COLUMN `measurement`,
    DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    DROP COLUMN `reOrderPoint`,
    DROP COLUMN `reference`,
    DROP COLUMN `status`,
    DROP COLUMN `stockNo`,
    DROP COLUMN `transaction_purpose`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `user_id`,
    ADD COLUMN `department_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `ris` INTEGER NULL,
    ADD COLUMN `status_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `transaction_purpose_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATE NOT NULL,
    MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `transaction_purpose` MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATE NOT NULL;

-- AlterTable
ALTER TABLE `transaction_status` MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATE NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `requestor_type_id` VARCHAR(191) NULL,
    ADD COLUMN `role_id` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATE NOT NULL;

-- CreateTable
CREATE TABLE `requestor_type` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATE NOT NULL,

    UNIQUE INDEX `requestor_type_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requisition_issue_slip_counter` (
    `id` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `current_ris` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATE NOT NULL,

    UNIQUE INDEX `requisition_issue_slip_counter_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_item` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `stock_no` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `approved_quantity` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATE NOT NULL,
    `history_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_notification` (
    `id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `transaction_purpose_id` VARCHAR(191) NOT NULL,
    `no_item` INTEGER NOT NULL,
    `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATE NOT NULL,
    `viewed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_notification` (
    `id` VARCHAR(191) NOT NULL,
    `status_id` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `created_at` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATE NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `role_name_key` ON `role`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `stock_type_name_key` ON `stock_type`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `transaction_purpose_name_key` ON `transaction_purpose`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `transaction_status_name_key` ON `transaction_status`(`name`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_requestor_type_id_fkey` FOREIGN KEY (`requestor_type_id`) REFERENCES `requestor_type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_stock_type_id_fkey` FOREIGN KEY (`stock_type_id`) REFERENCES `stock_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_history` ADD CONSTRAINT `stock_history_stock_no_fkey` FOREIGN KEY (`stock_no`) REFERENCES `stock`(`stock_no`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `transaction_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_transaction_purpose_id_fkey` FOREIGN KEY (`transaction_purpose_id`) REFERENCES `transaction_purpose`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_stock_no_fkey` FOREIGN KEY (`stock_no`) REFERENCES `stock`(`stock_no`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_item` ADD CONSTRAINT `transaction_item_history_id_fkey` FOREIGN KEY (`history_id`) REFERENCES `stock_history`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_notification` ADD CONSTRAINT `admin_notification_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_notification` ADD CONSTRAINT `admin_notification_transaction_purpose_id_fkey` FOREIGN KEY (`transaction_purpose_id`) REFERENCES `transaction_purpose`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_notification` ADD CONSTRAINT `department_notification_status_id_fkey` FOREIGN KEY (`status_id`) REFERENCES `transaction_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_notification` ADD CONSTRAINT `department_notification_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
