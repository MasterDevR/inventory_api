const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPassword = require("../utils/encryp-password");
const createAdmin = async () => {
  const password = await encrypPassword("password");
  console.log(password);
  try {
    const newAdmin = await prisma.adminInformation.createMany({
      data: [
        {
          adminId: "111-111-111",
          role: "APPROVER",
          password: password,
        },
        {
          adminId: "000-000-000",
          role: "RECEIVER",
          password: password,
        },
      ],
    });
  } catch (error) {
    console.error("Error creating admins:", error);
  }
};

module.exports = createAdmin;
