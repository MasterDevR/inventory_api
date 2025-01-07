const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (year) => {
  try {
    const availableYear = await prisma.stock_history.findMany({
      select: {
        created_at: true,
      },
    });
    const filteredYear = [
      ...new Set(
        availableYear.map((entry) => new Date(entry.created_at).getFullYear())
      ),
    ];
    const users = await prisma.user.findMany({
      select: {
        requestor_type_id: true,
        department_id: true,
        department_code: true,
        department: true,
        transaction: {
          where: {
            created_at: {
              gte: new Date(`${+year}-01-01T00:00:00.000Z`),
              lt: new Date(`${+year + 1}-01-01T00:00:00.000Z`),
            },
          },
          select: {
            created_at: true,
            total_price_per_transaction: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return { status: 404, message: "No data found", year: filteredYear };
    }
    // Filter out specific users
    const filteredUsers = users.filter(
      (user) =>
        !(
          user.department_id === "000-000-001" ||
          user.department_id === "000-000-000"
        )
    );

    // Sort filtered users by specific requestor_type_id sequence
    const requestorOrder = [
      "f99b5f58-6f73-4e77-8b94-e87d745efd9f", // executive
      "068b3f86-7bea-40d1-932e-8a3e390cc9c9", // admin
      "09491eab-6413-4deb-ab73-94efd7c4a9a8", // academic
      "afd7db3b-ede1-4ba5-82df-378775746cf0", // support
    ];

    const sortedUsers = filteredUsers.sort(
      (a, b) =>
        requestorOrder.indexOf(a.requestor_type_id) -
        requestorOrder.indexOf(b.requestor_type_id)
    );

    return { status: 200, transactions: sortedUsers, year: filteredYear };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong.",
      error: error,
    };
  }
};
