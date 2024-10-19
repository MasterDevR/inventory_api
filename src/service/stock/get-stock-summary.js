const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (year, month = 12) => {
  try {
    // Calculate the start and end date for the specified month
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfMonth = new Date(
      `${year}-${String(month).padStart(2, "0")}-${new Date(
        year,
        month,
        0
      ).getDate()}T23:59:59.999Z`
    );

    // Retrieve stock history up to the selected month
    const stockHistory = await prisma.stock_history.findMany({
      where: {
        created_at: {
          gte: startOfYear, // Start from the beginning of the year
          lte: endOfMonth, // Up to the end of the selected month
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

    // Check if stock history is empty
    if (stockHistory.length === 0) {
      return { status: 404, message: "No data found." };
    }

    // Retrieve transaction items within the same date range
    const transactionItems = await prisma.transaction_item.findMany({
      where: {
        created_at: {
          gte: startOfYear, // Start from the beginning of the year
          lte: endOfMonth, // Up to the end of the selected month
        },
      },
    });

    // Calculate total quantities issued from transaction items
    const totalIssuedByStockNo = transactionItems.reduce((acc, item) => {
      if (!acc[item.stock_no]) {
        acc[item.stock_no] = [];
      }
      acc[item.stock_no].push(item.approved_quantity);
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
          qty: availableQty[stockNo] || 0,
          stock_on_hand: [],
          price: [],
          quantity_issued: [],
          purchase_order_numbers: [],
          initial_qty: [],
        };
      }

      const issuedQty = item.quantity_issued || "";

      const poIndex =
        acc[stockNo].purchase_order_numbers.indexOf(purchaseOrder);

      if (poIndex === -1) {
        acc[stockNo].purchase_order_numbers.push(purchaseOrder);
        acc[stockNo].quantity_issued.push(issuedQty);
      } else {
        acc[stockNo].quantity_issued[poIndex] += issuedQty;
      }

      acc[stockNo].stock_on_hand.push(item.quantity_on_hand);
      acc[stockNo].price.push(item.price || 0);
      acc[stockNo].initial_qty.push(
        item.quantity_issued + (item.quantity_on_hand || 0)
      );

      return acc;
    }, {});

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
    const purchaseNo = [
      ...new Set(stockHistory.map((item) => item.purchase_order)),
    ];

    return { status: 200, purchaseNo, groupedData };
  } catch (error) {
    console.error("Error fetching stock summary:", error);
    return { status: 500, message: "Something went wrong." };
  }
};
