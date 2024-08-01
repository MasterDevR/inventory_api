/*
  Warnings:

  - A unique constraint covering the columns `[department_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_department_id_key` ON `user`(`department_id`);
