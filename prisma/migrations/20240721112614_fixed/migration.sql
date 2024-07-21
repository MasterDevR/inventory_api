/*
  Warnings:

  - Made the column `role` on table `departmentinformation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `departmentinformation` MODIFY `role` ENUM('RECEIVER', 'APPROVER', 'DEPARTMENT') NOT NULL;
