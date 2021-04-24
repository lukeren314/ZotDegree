const express = require("express");
require("dotenv").config({ path: __dirname + "/.env" });
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());

app.use(cors());

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../client/build")));

// main index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.listen(port, () => console.log(`Server Start! Listening on port ${port}`));
