const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAdmin = async () => {
  try {
    const newAdmin = await prisma.adminInformation.createMany({
      data: [
        {
          adminId: "111-111-111",
          role: "APPROVER",
        },
        {
          adminId: "000-000-000",
          role: "RECEIVER",
        },
      ],
    });

    console.log(newAdmin);
  } catch (error) {
    console.error("Error creating admins:", error);
  }
};

module.exports = createAdmin;
