require("dotenv").config();
const express = require("express");
const db = require("./models");

const app = express();
PORT = process.env.PORT || "5000";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user", require("./routes/api/user-route"));
app.use("/api/profile", require("./routes/api/profile-route"));
app.use("/api/history", require("./routes/api/history-route"));

app.get("/", (req, res) => {
  res.send("default page");
});

db.sequelize.sync().then(() => {
  console.log("Database is connected...");
  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}...`);
  });
});
