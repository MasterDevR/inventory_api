const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPassword = require("../../utils/encryp-password");

const createUser = async (userData) => {
  try {
    const {
      Email,
      password,
      department_id,
      department_code,
      department,
      imageSrc,
    } = userData;

    if (
      !Email ||
      !password ||
      !department_id ||
      !department_code ||
      !department ||
      !imageSrc
    ) {
      return { status: 400, message: "Missing required user data fields" };
    }

    // Check if any user already exists with any of the unique fields
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: Email },
          { department_id: department_id },
          { department_code: department_code },
          { department: department },
          { image: imageSrc },
        ],
      },
    });

    if (existingUser) {
      return {
        status: 409,
        message: "User with one or more unique fields already exists",
      };
    }

    const encryptedPassword = await encrypPassword(password);

    const userRole = await prisma.role.findFirst({
      where: {
        name: "user",
      },
    });

    if (!userRole) {
      return { status: 404, message: "User role not found" };
    }

    const result = await prisma.user.create({
      data: {
        email: Email,
        department_id: department_id,
        department_code: department_code,
        department: department,
        role: userRole.id,
        image: imageSrc,
        password: encryptedPassword,
      },
    });

    return { status: 200, message: "User created successfully" };
  } catch (error) {
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = createUser;
