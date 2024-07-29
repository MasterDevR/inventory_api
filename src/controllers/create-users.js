const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPasswod = require("../utils/encryp-password");
const createUser = async () => {
  const password = await encrypPasswod("password");
  try {
    const newUsers = await prisma.departmentInformation.createMany({
      data: [
        {
          deptId: "000-000-001",
          deptCode: "cet",
          department: "college of engineering",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-002",
          deptCode: "cas",
          department: "college of arts and science",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-003",
          deptCode: "ced",
          department: "college of education",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-004",
          deptCode: "cba",
          department: "college of business administration",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-005",
          deptCode: "ccj",
          department: "college of criminal justice",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-006",
          deptCode: "shs",
          department: "senior high school",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-007",
          deptCode: "chs",
          department: "college of health and science",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-008",
          deptCode: "registar",
          department: "registar",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-009",
          deptCode: "clinic",
          department: "clinic",
          role: "DEPARTMENT",
          password: password,
        },
        {
          deptId: "000-000-010",
          deptCode: "cashier",
          department: "cashier",
          role: "DEPARTMENT",
          password: password,
        },
      ],
    });
    return newUsers;
  } catch (error) {
    console.error("Error creating admins:", error);
  }
};

module.exports = createUser;
