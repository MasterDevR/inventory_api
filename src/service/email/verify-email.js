const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      return { status: 200 };
    } else {
      return {
        status: 404,
        message: "Please enter a valid email address.",
      };
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return { status: 500, message: "Something went wrong." };
  }
};
