const { emitToAdmin, emitToUser } = require("../socket");

const receiveSupportMessage = (req, res) => {
  const message = {
    userId: req.body.userId || req.user?.sub || "guest",
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    createdAt: new Date().toISOString(),
  };

  emitToAdmin("support_message_received", message);
  if (message.userId !== "guest") {
    emitToUser(message.userId, "support_message_received", message);
  }

  return res.status(202).json({
    success: true,
    message: "Support message received.",
  });
};

module.exports = {
  receiveSupportMessage,
};
