import Notification from "../Models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      receiver: req.userId,
    })
      .populate(
        "sender",
        "firstName lastName profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(notifications);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Notification error",
    });
  }
};

export const readNotifications = async (req, res) => {
  try {

    await Notification.updateMany(
      { receiver: req.userId },
      { read: true }
    );

    return res.status(200).json({
      message: "Notifications read",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Read notification error",
    });
  }
};