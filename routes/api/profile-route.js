const express = require("express");
const router = express.Router();
const db = require("./../../models");
const { v4: uuidv4 } = require("uuid");

router.get("/", (req, res) => {
  db.Profile.findAll({
    include: [db.User],
  })
    .then((allProfile) => res.send(allProfile))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

router.get("/:id", (req, res) => {
  db.Profile.findOne({
    where: {
      id: req.params.id,
      include: [db.User],
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
  })
    .then((selectedUser) => {
      if (!selectedUser) {
        res.status(404).json({ msg: "User does not exist!" });
      }
      if (selectedUser.Profile === null || selectedUser.Profile === undefined) {
        db.Profile.create({
          id: uuidv4(),
          fullname: req.body.fullname,
          about: req.body.about,
          UserId: req.body.UserId,
        })
          .then((newProfile) => res.send(newProfile))
          .catch((err) => res.status(400).json({ msg: err.message }));
      } else {
        res.status(400).json({ msg: "Profile already exist!" });
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
    .then((modifiedUser) => {
      if (!modifiedUser) {
        res.status(400).json({ msg: "No profile defined!" });
      }

      if (req.body.fullname) {
        modifiedUser.fullname = req.body.fullname;
      }
      if (req.body.about) {
        modifiedUser.about = req.body.about;
      }
      modifiedUser
        .save()
        .then(res.send(modifiedUser))
        .catch((err) =>
          res.status(400).json({ msg: "Error updating profile!" })
        );
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
        .catch((e) => res.status(400).json({ msg: e.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

module.exports = router;
