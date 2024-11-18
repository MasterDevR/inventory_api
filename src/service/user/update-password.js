const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

module.exports = async (department_id, old_password, new_password) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        department_id: department_id,
      },
    });

    if (!user) {
      return { status: 404, message: "User not found." };
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return { status: 400, message: "Old password is incorrect." };
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: {
        department_id: department_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { status: 200, message: "Password updated successfully." };
  } catch (err) {
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
