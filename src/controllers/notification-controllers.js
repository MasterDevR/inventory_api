const getAllAdminNotification = require("../service/notification/get-admin-notification");
const setViewedNotification = require("../service/notification/set-viewed-notification");
const getAdminNotification = async (req, res) => {
  const result = await getAllAdminNotification();

  res.send({ status: 200, result });
};
const updateNotification = async (req, res) => {
  await setViewedNotification();
  res.sendStatus(200);
};

module.exports = { getAdminNotification, updateNotification };
