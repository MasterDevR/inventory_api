const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

module.exports = async (department_id, current_password, new_email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        department_id: department_id,
      },
    });

    if (!user) {
      return { status: 404, message: "User not found." };
    }
    // Verify the current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return { status: 400, message: "Password is incorrect." };
    }
    // Check if the new email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: new_email,
      },
    });

    if (existingUser) {
      return { status: 400, message: "Email already in use." };
    }
    console.log(existingUser);

    await prisma.user.update({
      where: {
        department_id: department_id,
      },
      data: {
        email: new_email,
      },
    });

    return { status: 200, message: "Email updated successfully." };
  } catch (err) {
    console.error("Error updating email:", err.message);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
