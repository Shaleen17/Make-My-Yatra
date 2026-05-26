const { env } = require("./env");

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || env.clientOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
};

module.exports = corsOptions;
