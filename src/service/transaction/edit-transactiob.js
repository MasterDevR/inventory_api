const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getEditTransaction = async (id) => {
  try {
    const result = await prisma.transaction.findUnique({
      where: { id: id },
      include: {
        transaction_item: {
          include: {
            stock: {
              select: {
                description: true,
                measurement: true,
              },
            },
          },
        },
      },
    });
    return { status: 200, message: "Success", result: result };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something Went Wrong", result: [] };
  }
};

const putEditTransaction = async (latestRequest, id) => {
  try {
    // Fetch original transaction items
    const originalTransaction = await prisma.transaction_item.findMany({
      where: {
        transaction_id: id,
      },
    });

    // Update each transaction item based on the latest request
    const updatePromises = latestRequest.map(async (item) => {
      return await prisma.transaction_item.update({
        where: { id: item.id }, // Match by the unique ID of the transaction item
        data: {
          quantity: item.quantity,
          approved_quantity: item.approved_quantity,
        },
      });
    });

    // Identify items to delete
    const itemsToDelete = originalTransaction.filter(
      (originalItem) =>
        !latestRequest.some((requestItem) => requestItem.id === originalItem.id)
    );

    // Delete items that are not in the latest request
    const deletePromises = itemsToDelete.map(async (item) => {
      return await prisma.transaction_item.delete({
        where: { id: item.id },
      });
    });

    await Promise.all(deletePromises); // Wait for all deletions to complete

    const updatedTransaction = await Promise.all(updatePromises);

    console.log("original ", originalTransaction);
    console.log("updated Data ", updatedTransaction);
    return {
      status: 200,
      message: "Request Update Successful",
    };
  } catch (error) {
    return { status: 500, message: "Something Went Wrong" };
  }
};

const deleteTransaction = async (id) => {
  try {
    // Delete transaction items associated with the transaction ID
    await prisma.transaction_item.deleteMany({
      where: {
        transaction_id: id,
      },
    });

    // Fetch department notifications associated with the transaction ID
    const departmentNotifications =
      await prisma.department_notification.findMany({
        where: {
          transaction_id: id,
        },
      });

    // Delete each department notification using its unique ID
    const deleteDepartmentNotificationPromises = departmentNotifications.map(
      (notification) =>
        prisma.department_notification.delete({
          where: { id: notification.id },
        })
    );

    await Promise.all(deleteDepartmentNotificationPromises); // Wait for all deletions to complete

    // Fetch admin notifications associated with the transaction ID
    const adminNotifications = await prisma.admin_notification.findMany({
      where: {
        transaction_id: id,
      },
    });

    // Delete each admin notification using its unique ID
    const deleteAdminNotificationPromises = adminNotifications.map(
      (notification) =>
        prisma.admin_notification.delete({
          where: { id: notification.id },
        })
    );

    await Promise.all(deleteAdminNotificationPromises); // Wait for all deletions to complete

    // Delete the transaction itself
    await prisma.transaction.delete({
      where: { id: id },
    });

    return {
      status: 200,
      message: "Transaction and associated items deleted successfully",
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: 500,
      message: "Failed to delete transaction and associated items",
    };
  }
};
module.exports = { getEditTransaction, putEditTransaction, deleteTransaction };
