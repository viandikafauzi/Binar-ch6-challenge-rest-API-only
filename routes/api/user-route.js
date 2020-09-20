const express = require("express");
const router = express.Router();
const db = require("./../../models");
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
  db.User.findAll({
    include: [db.Profile, db.History],
  })
    .then((allUser) => res.send(allUser))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.get("/:id", (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((selectedUser) => {
      if (!selectedUser) {
        res.status(404).json({ msg: "User does not exist!" });
      }

      res.json(selectedUser);
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.post("/", (req, res) => {
  db.User.create({
    id: uuidv4(),
    username: req.body.username,
    password: req.body.password,
  })
    .then((newUser) => res.send(newUser))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.put("/:id", (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((modifiedUser) => {
      if (!modifiedUser) {
        res.status(404).json({ msg: "No user defined!" });
      }

      modifiedUser.username = modifiedUser.username || req.body.username;
      modifiedUser.password = req.body.password || modifiedUser.password;

      modifiedUser
        .save()
        .then(res.send(modifiedUser))
        .catch((err) => res.status(501).json({ msg: "Error updating user!" }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.delete("/:id", (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).json({ msg: "User does not exist!" });
      }

      // res.json(deletedUser);
      deletedUser
        .destroy()
        .then(res.json({ msg: "User successfully deleted" }))
        .catch((e) => res.status(400).json({ msg: e.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

module.exports = router;
