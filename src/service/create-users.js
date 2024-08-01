const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPassword = require("../utils/encryp-password");

const createUser = async () => {
  try {
    const password = await encrypPassword("password");
    const users = await prisma.user.createMany({
      data: [
        {
          department_id: "000-000-000",
          role: "63d2ada1-3981-4145-b1e7-8b24c2e8d1a7",
          department_code: "admin1",
          department: "admin1",
          name: "admin",
          password: password,
        },
        {
          department_id: "000-000-001",
          role: "6a15b084-4a6f-4d3d-96b5-91d23e6e2f90",
          department_code: "admin2",
          department: "admin2",
          name: "admin",
          password: password,
        },
        {
          department_id: "000-000-002",
          role: "7c1d2a2f-bc3f-4bfb-8491-3d3f9e9d1a8d",
          department_code: "CET",
          department: "College Of Engineering and Technology",
          password: password,
        },
        {
          department_id: "000-000-003",
          role: "7c1d2a2f-bc3f-4bfb-8491-3d3f9e9d1a8d",
          department_code: "CED",
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
