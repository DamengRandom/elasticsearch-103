const express = require("express");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 7337;

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`App is started with port ${port}.`);
});

// reference: https://medium.com/yom-ai/rest-api-with-node-js-and-elasticsearch-1368cf9df02a
