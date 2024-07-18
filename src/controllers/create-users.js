const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUserHandler = async (usersDataArray) => {
  const newUsers = await prisma.userTable.createMany({
    data: usersDataArray,
  });

  return newUsers;
};

module.exports = createUserHandler;
