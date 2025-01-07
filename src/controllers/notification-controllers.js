const getAllAdminNotification = require("../service/notification/get-admin-notification");
const setViewedNotification = require("../service/notification/set-viewed-notification");
const checkLowStockAndNotifyAdmin = require("../service/notification/check-low-stock-notification");

const getAdminNotification = async (req, res) => {
  try {
    const { get = 5 } = req.query;
    const [result, lowStockResult] = await Promise.all([
      getAllAdminNotification(+get),
      checkLowStockAndNotifyAdmin(+get),
    ]);
    res.status(200).json({
      result: result.result,
      lowStockResult,
      hasMore: result.count >= get || lowStockResult.length >= get,
    });
  } catch (error) {
    console.error("Error in getAdminNotification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateNotification = async (req, res) => {
  await setViewedNotification();
  res.sendStatus(200);
};

module.exports = { getAdminNotification, updateNotification };
