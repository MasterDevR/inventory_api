const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (year, month = 12) => {
  try {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfMonth = new Date(
      `${year}-${String(month).padStart(2, "0")}-${new Date(
        year,
        month,
        0
      ).getDate()}T23:59:59.999Z`
    );

    const stockHistory = await prisma.stock_history.findMany({
      orderBy: {
        stock: {
          item: "asc",
        },
      },
      where: {
        created_at: {
          gte: startOfYear,
          lte: endOfMonth,
        },
      },
      include: {
        stock: {
          select: {
            description: true,
            quantity_on_hand: true,
          },
        },
      },
    });
    if (stockHistory.length === 0) {
      return { status: 404, message: "No data found." };
    }

    const transactionItems = await prisma.transaction_item.findMany({
      orderBy: {
        stock: {
          description: "asc",
        },
      },
      where: {
        created_at: {
          gte: startOfYear,
          lte: endOfMonth,
        },
      },
    });

    const totalIssuedByStockNo = transactionItems.reduce((acc, item) => {
      if (!acc[item.stock_no]) {
        acc[item.stock_no] = 0;
      }
      acc[item.stock_no] += item.approved_quantity;
      return acc;
    }, {});

    const availableQty = stockHistory.reduce((acc, item) => {
      const stockNo = item.stock_no;

      if (!acc[stockNo]) {
        acc[stockNo] = 0;
      }

      acc[stockNo] += item.quantity_on_hand || 0;

      return acc;
    }, {});

    const stockGroupedByPO = stockHistory.reduce((acc, item) => {
      const stockNo = item.stock_no;
      const purchaseOrder = item.purchase_order;

      if (!acc[stockNo]) {
        acc[stockNo] = {
          stock_no: stockNo,
          description: item.stock.description,
          qty: 0, // We'll calculate this later
          stock_on_hand: [],
          price: [],
          quantity_issued: [],
          purchase_order_numbers: [],
          initial_qty: [],
        };
      }

      const issuedQty = totalIssuedByStockNo[stockNo] || 0;

      const poIndex =
        acc[stockNo].purchase_order_numbers.indexOf(purchaseOrder);

      if (poIndex === -1) {
        acc[stockNo].purchase_order_numbers.push(purchaseOrder);
        acc[stockNo].quantity_issued.push(issuedQty);
      } else {
        acc[stockNo].quantity_issued[poIndex] = issuedQty;
      }

      acc[stockNo].stock_on_hand.push(item.quantity_on_hand);
      acc[stockNo].price.push(item.price || 0);
      acc[stockNo].initial_qty.push(
        item.quantity_issued + (item.quantity_on_hand || 0)
      );

      return acc;
    }, {});

    // Calculate qty after the reduce operation
    Object.values(stockGroupedByPO).forEach((stock) => {
      const totalInitialQty = stock.initial_qty.reduce(
        (sum, qty) => sum + qty,
        0
      );
      const totalIssuedQty = stock.quantity_issued.reduce(
        (sum, qty) => sum + qty,
        0
      );
      stock.qty = Math.max(totalInitialQty - totalIssuedQty, 0);
    });

    // Prepare final output
    const groupedData = Object.values(stockGroupedByPO).map((stock) => {
      return {
        stock_no: stock.stock_no,
        description: stock.description,
        qty: stock.qty, // Remaining quantity
        stock_on_hand: stock.stock_on_hand,
        price: stock.price,
        quantity_issued: stock.quantity_issued,
        purchase_order_numbers: Array.from(stock.purchase_order_numbers),
        initial_qty: stock.initial_qty,
      };
    });

    // Prepare response
    const purchaseNoWithDates = stockHistory
      .reduce((acc, item) => {
        if (!acc.some((po) => po.purchase_order === item.purchase_order)) {
          acc.push({
            purchase_order: item.purchase_order,
            created_at: item.created_at,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return (
          dateA.getMonth() - dateB.getMonth() ||
          dateA.getDate() - dateB.getDate()
        );
      });

    const purchaseNo = purchaseNoWithDates.map((item) => item.purchase_order);
    return { status: 200, purchaseNo, groupedData };
  } catch (error) {
    const users = await prisma.user.findMany();

    return {
      status: 500,
      message: `Something went wrong.`,
    };
  } finally {
    await prisma.$disconnect();
  }
};
