const cc = require("currency-converter-lt");
const morgan = require("morgan");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const fs = require("fs");
const parser = require("body-parser");

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/:currency_1/:currency_2/:value", (req, res) => {
  let cur1 = req.params["currency_1"];
  let cur2 = req.params["currency_2"];
  let value = req.params["value"];
  let currencyConverter = new cc({
    from: cur1,
    to: cur2,
    amount: parseInt(value),
  });
  currencyConverter.convert().then((result) => {
    res.json({ message: result });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const config = dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log(`Server started on port ${port}!`);
});
