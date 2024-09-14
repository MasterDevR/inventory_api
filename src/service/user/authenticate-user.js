const { PrismaClient, role } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const findUserByDeptId = async ({ username, password }) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        department_id: username,
      },
      select: {
        department_id: true,
        image: true,
      },
    });

    if (!findUser) {
      return { status: 404, message: "Invalid department ID." };
    }

    const authPassword = await authenticatePassword({ username, password });
    return authPassword;
  } catch (err) {
    return { status: 500, message: "Internal Server Error" };
  } finally {
    prisma.$disconnect();
  }
};

// check password
const authenticatePassword = async ({ username, password }) => {
  try {
    // check department table
    const findUser = await prisma.user.findUnique({
      where: {
        department_id: username,
      },
      select: {
        id: true,
        Role: {
          select: {
            name: true,
          },
        },
        department_id: true,
        name: true,
        password: true,
      },
    });

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return { status: 401, message: "Invalid password." };
    }

    return { status: 200, findUser };
  } catch (err) {
    return {
      status: 500,
      message: "Internal Server Error. Please Contact Admin",
      err,
    };
  } finally {
    prisma.$disconnect();
  }
};
module.exports = findUserByDeptId;
