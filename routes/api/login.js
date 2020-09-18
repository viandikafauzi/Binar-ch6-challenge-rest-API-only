const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (req.body.username === "admin" && req.body.password === "admin") {
    res.render("dashboard");
  } else {
    res.render("loginfailed");
  }
});

module.exports = router;
