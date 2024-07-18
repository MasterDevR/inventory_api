-- CreateTable
CREATE TABLE `departmentInformation` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `deptId` VARCHAR(191) NOT NULL,
    `deptCode` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL DEFAULT 'defaultpassword',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `departmentInformation_deptId_key`(`deptId`),
    UNIQUE INDEX `departmentInformation_deptCode_key`(`deptCode`),
    UNIQUE INDEX `departmentInformation_department_key`(`department`),
    UNIQUE INDEX `departmentInformation_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adminInformation` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `adminId` VARCHAR(191) NOT NULL,
    `role` ENUM('RECEIVER', 'APPROVER') NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL DEFAULT 'defaultpassword',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `adminInformation_adminId_key`(`adminId`),
    UNIQUE INDEX `adminInformation_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stockInformation` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `fund` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `stockNo` VARCHAR(191) NOT NULL,
    `preOrderPrint` VARCHAR(191) NOT NULL,
    `unitOfmeasurement` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stockInformation_stockNo_key`(`stockNo`),
    UNIQUE INDEX `stockInformation_preOrderPrint_key`(`preOrderPrint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requestInformation` (
    `id` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `stockNo` VARCHAR(191) NOT NULL,
    `deptId` VARCHAR(191) NOT NULL,
    `requestType` ENUM('OFFICE', 'OTHER') NULL,
    `request_status` ENUM('PENDING', 'REVIEWING', 'APPROVED', 'PREPARING', 'READY', 'REJECTED') NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `requestInformation` ADD CONSTRAINT `requestInformation_stockNo_fkey` FOREIGN KEY (`stockNo`) REFERENCES `stockInformation`(`stockNo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requestInformation` ADD CONSTRAINT `requestInformation_deptId_fkey` FOREIGN KEY (`deptId`) REFERENCES `departmentInformation`(`deptId`) ON DELETE RESTRICT ON UPDATE CASCADE;
