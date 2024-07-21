/*
  Warnings:

  - The values [DEPARMENT] on the enum `adminInformation_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `role` on the `departmentinformation` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `admininformation` MODIFY `role` ENUM('RECEIVER', 'APPROVER', 'DEPARTMENT') NOT NULL;

-- AlterTable
ALTER TABLE `departmentinformation` MODIFY `role` ENUM('RECEIVER', 'APPROVER', 'DEPARTMENT') NULL;
