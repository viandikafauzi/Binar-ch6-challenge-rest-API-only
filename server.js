require("dotenv").config();
const express = require("express");
const db = require("./models");

const app = express();
PORT = process.env.PORT || "5000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/api/user", require("./routes/api/user-route"));
app.use("/api/profile", require("./routes/api/profile-route"));
app.use("/api/history", require("./routes/api/history-route"));
app.use("/api/login", require("./routes/api/login"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/user/create", (req, res) => {
  res.render("user/create");
});
app.get("/user/view", (req, res) => {
  res.render("user/view");
});
app.use("/user/getview", require("./routes/api/user-route"));

db.sequelize.sync().then(() => {
  console.log("Database is connected...");
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`);
  });
});
