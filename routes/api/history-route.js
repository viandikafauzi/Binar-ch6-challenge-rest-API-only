const express = require("express");
const router = express.Router();
const db = require("./../../models");
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
  db.History.findAll()
    .then((allHistory) => res.send(allHistory))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.get("/:id", (req, res) => {
  db.History.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((selectedHistory) => {
      if (!selectedHistory) {
        res.status(400).json({ msg: "History does not exist!" });
      }

      res.json(selectedHistory);
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.post("/", (req, res) => {
  db.User.findOne({
    where: {
      id: req.body.UserId,
    },
    include: [db.History],
  })
    .then((selectedUser) => {
      db.History.create({
        id: uuidv4(),
        player_choice: req.body.player_choice,
        com_choice: req.body.com_choice,
        player_result: req.body.player_result,
        UserId: req.body.UserId,
      })
        .then((newHistory) => res.send(newHistory))
        .catch((err) => res.status(500).json({ msg: err.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.delete("/:id", (req, res) => {
  db.History.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedHistory) => {
      if (!deletedHistory) {
        res.status(404).json({ msg: "History does not exist!" });
      }
      deletedHistory
        .destroy()
        .then(res.json({ msg: "History successfully deleted" }))
        .catch((e) => res.status(500).json({ msg: e.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

module.exports = router;
