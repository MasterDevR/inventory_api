const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const monthList = [
  {
    name: "January",
    value: 0,
  },
  {
    name: "February",
    value: 1,
  },
  {
    name: "March",
    value: 2,
  },
  {
    name: "April",
    value: 3,
  },
  {
    name: "May",
    value: 4,
  },
  {
    name: "June",
    value: 5,
  },
  {
    name: "July",
    value: 6,
  },
  {
    name: "August",
    value: 7,
  },
  {
    name: "September",
    value: 8,
  },
  {
    name: "October",
    value: 9,
  },
  {
    name: "November",
    value: 10,
  },
  {
    name: "December",
    value: 11,
  },
];
module.exports = async (stock_no, year, month) => {
  //wrap to try catch

  try {
    // get all stock card by stock_no and same year based on created_at and transaction_item is not empty
    const stocks = await prisma.stock_history.findMany({
      where: {
        stock_no,
        created_at: {
          gte: new Date(new Date().getFullYear(), 0, 1),
          lte: new Date(new Date().getFullYear(), 11, 31),
        },
        transaction_item: {
          some: {},
        },
      },
      select: {
        stock: {
          select: {
            consume_date: true,
            item: true,
            description: true,
            stock_no: true,
            measurement: true,
          },
        },
        quantity_issued: true,
        transaction_item: {
          where: { approved_quantity: { gt: 0 } },
        },
      },
    });
    // check if stocks is empty
    if (stocks.length === 0) {
      return { status: 404, message: "Stock not found." };
    }

    const availableYear = await prisma.stock_history.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        created_at: true,
      },
    });
    // year might be an array, store each year in an array dont include the year twice
    const uniqueYear = [
      ...new Set(availableYear.map((item) => item.created_at.getFullYear())),
    ];

    const initailQty = await prisma.stock_history.findMany({
      // get the oldest stock_history by created_at
      where: {
        stock_no,
        created_at: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month, 31),
        },
      },
      select: {
        quantity_on_hand: true,
        quantity_issued: true,
        created_at: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    // get the month name from the month value

    const monthNameArray = monthList.filter((item) => item.value === +month);
    if (initailQty.length === 0) {
      return {
        status: 404,
        data: stocks,
        availableYear: uniqueYear,
        message: `No Stock Card Available on the month of ${monthNameArray[0].name} year ${year}`,
      };
    }
    const firstData = initailQty[0];
    // sum of each initial quantity
    const initialQty = initailQty.reduce(
      (acc, curr) => acc + curr.quantity_on_hand + curr.quantity_issued,
      0
    );
    let deductedQty = initialQty;
    // Loop through each stock to calculate balance and get department_id

    for (const stock of stocks) {
      // Calculate balance
      for (const item of stock.transaction_item) {
        const transaction = await prisma.transaction.findUnique({
          where: { id: item.transaction_id }, // Get transaction by id
          select: {
            department_id: true,
            ris: true, // Select only the department_id from Transaction
          },
        });

        // Concatenate department_id to transaction_item
        const Office = await prisma.user.findFirst({
          where: { department_id: transaction.department_id },
          select: {
            department_code: true,
          },
        });
        item.office = Office && Office.department_code; // Add department_id to the item
        item.ris = transaction ? transaction.ris : null; // Add ris to the item
        item.balance = deductedQty - item.approved_quantity;
        deductedQty = deductedQty - item.approved_quantity;
      }
    }

    return {
      status: 200,
      data: stocks,
      initialQty,
      initialDate: firstData.created_at,
      availableYear: uniqueYear,
    };
  } catch (error) {
    console.error("Error in getStockCard:", error);
    return { status: 500, message: "Something went wrong." };
  }
};
