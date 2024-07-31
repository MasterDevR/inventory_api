const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPassword = require("../utils/encryp-password");

const createUser = async () => {
  try {
    const password = await encrypPassword("password");
    const users = await prisma.userInformation.createMany({
      data: [
        {
          deptId: "000-000-000",
          role: "RECEIVER",
          deptCode: "admin1",
          department: "admin1",
          password: password,
        },
        {
          deptId: "000-000-001",
          role: "APPROVER",
          deptCode: "admin2",
          department: "admin2",
          password: password,
        },
        {
          deptId: "000-000-002",
          role: "DEPARTMENT",
          deptCode: "CET",
          department: "College Of Engineering and Technology",
          password: password,
        },
        {
          deptId: "000-000-003",
          role: "DEPARTMENT",
          deptCode: "CED",
          department: "College Of Education",
          password: password,
        },
      ],
    });
    console.log("users : ", users);
    return users;
  } catch (error) {
    console.error("Error creating users:", error);
  }
};

module.exports = createUser;
