const express = require("express");
const router = express.Router();
const db = require("./../../models");
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
  db.Profile.findAll()
    .then((allProfile) => res.send(allProfile))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.get("/:id", (req, res) => {
  db.Profile.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((selectedProfile) => {
      if (!selectedProfile) {
        res.status(400).json({ msg: "Profile does not exist!" });
      }

      res.json(selectedProfile);
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.post("/", (req, res) => {
  db.User.findOne({
    where: {
      id: req.body.UserId,
    },
    include: [db.Profile],
  })
    .then((selectedUser) => {
      if (selectedUser.Profile === null || selectedUser.Profile === undefined) {
        db.Profile.create({
          id: uuidv4(),
          fullname: req.body.fullname,
          about: req.body.about,
          UserId: req.body.UserId,
        })
          .then((newProfile) => res.send(newProfile))
          .catch((err) => res.status(500).json({ msg: err.message }));
      } else {
        res.status(403).json({ msg: "Profile already exist!" });
      }
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.put("/:id", (req, res) => {
  db.Profile.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((modifiedProfile) => {
      if (!modifiedProfile) {
        res.status(400).json({ msg: "No profile defined!" });
      }

      modifiedProfile.fullname = req.body.fullname || modifiedProfile.fullname;
      modifiedProfile.about = req.body.about || modifiedProfile.about;

      modifiedProfile
        .save()
        .then(res.send(modifiedProfile))
        .catch((err) => res.status(500).json({ msg: err.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.delete("/:id", (req, res) => {
  db.Profile.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedProfile) => {
      if (!deletedProfile) {
        res.status(404).json({ msg: "Profile does not exist!" });
      }
      deletedProfile
        .destroy()
        .then(res.json({ msg: "Profile successfully deleted" }))
        .catch((e) => res.status(500).json({ msg: e.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

module.exports = router;
