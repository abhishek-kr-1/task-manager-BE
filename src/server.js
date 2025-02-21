const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config");
const logger = require("./utils/logger");

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("MongoDB Connected"))
  .catch((err) => logger.error("MongoDB Connection Error:", err));

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
