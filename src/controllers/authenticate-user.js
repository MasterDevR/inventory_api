const { PrismaClient, role } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const findUserByDeptId = async ({ username, password }) => {
  try {
    const findUser = await prisma.departmentInformation.findUnique({
      where: {
        deptId: username,
      },
      select: {
        deptId: true,
      },
    });
    const findAdmin = await prisma.adminInformation.findUnique({
      where: {
        adminId: username,
      },
      select: {
        adminId: true,
      },
    });

    if (!findUser && !findAdmin) {
      return { status: 404, message: "Invalid department ID." };
    }

    const authPassword = await authenticatePassword({ username, password });
    return authPassword;
  } catch (err) {
    console.log("Caugtht : ", err.message);
    return { status: 500, message: "Internal Server Error" };
  } finally {
    prisma.$disconnect();
  }
};

// check password
const authenticatePassword = async ({ username, password }) => {
  let userData;
  try {
    // check department table
    const findUser = await prisma.departmentInformation.findUnique({
      where: {
        deptId: username,
      },
      select: {
        id: true,
        deptId: true,
        role: true,
        deptCode: true,
        password: true,
      },
    });

    userData = findUser;
    // check in admin table if nothing found on department table
    if (!findUser) {
      const findAdmin = await prisma.adminInformation.findUnique({
        where: {
          adminId: username,
        },
        select: {
          id: true,
          adminId: true,
          role: true,
          password: true,
          department: true,
        },
      });
      userData = findAdmin;
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return { status: 401, message: "Invalid password." };
    }

    return { status: 200, userData };
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
