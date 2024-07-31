-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('admin1', 'admin2', 'department') NOT NULL,
    `deptCode` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_userId_key`(`userId`),
    UNIQUE INDEX `user_deptCode_key`(`deptCode`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_information` (
    `id` VARCHAR(191) NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `totalQuantity` INTEGER NOT NULL,
    `stockNo` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NOT NULL,
    `reOrderPoint` VARCHAR(191) NOT NULL,
    `consumeDate` INTEGER NOT NULL,
    `measurement` VARCHAR(191) NOT NULL,
    `distributor` VARCHAR(191) NOT NULL,
    `stockCount` INTEGER NOT NULL,
    `qtyList` JSON NOT NULL,
    `dateList` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_information_id_key`(`id`),
    UNIQUE INDEX `stock_information_stockNo_key`(`stockNo`),
    UNIQUE INDEX `stock_information_reOrderPoint_key`(`reOrderPoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_details` (
    `id` VARCHAR(191) NOT NULL,
    `requesterId` VARCHAR(191) NOT NULL,
    `purpose` ENUM('office', 'other') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `request_details_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_item` (
    `id` VARCHAR(191) NOT NULL,
    `requisitionId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    UNIQUE INDEX `request_item_id_key`(`id`),
    INDEX `request_item_requisitionId_idx`(`requisitionId`),
    INDEX `request_item_itemId_idx`(`itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `request_details` ADD CONSTRAINT `request_details_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_item` ADD CONSTRAINT `request_item_requisitionId_fkey` FOREIGN KEY (`requisitionId`) REFERENCES `request_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_item` ADD CONSTRAINT `request_item_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `stock_information`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
