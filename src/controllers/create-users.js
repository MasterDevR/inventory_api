const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async () => {
  try {
    const newUsers = await prisma.departmentInformation.createMany({
      data: [
        {
          deptId: "000-000-001",
          deptCode: "cet",
          department: "college of engineering",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-002",
          deptCode: "cas",
          department: "college of arts and science",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-003",
          deptCode: "ced",
          department: "college of education",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-004",
          deptCode: "cba",
          department: "college of business administration",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-005",
          deptCode: "ccj",
          department: "college of criminal justice",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-006",
          deptCode: "shs",
          department: "senior high school",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-007",
          deptCode: "chs",
          department: "college of health and science",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-008",
          deptCode: "registar",
          department: "registar",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-009",
          deptCode: "clinic",
          department: "clinic",
          role: "DEPARMENT",
        },
        {
          deptId: "000-000-010",
          deptCode: "cashier",
          department: "cashier",
          role: "DEPARMENT",
        },
      ],
    });
    return newUsers;
  } catch (error) {
    console.error("Error creating admins:", error);
  }
};

module.exports = createUser;
