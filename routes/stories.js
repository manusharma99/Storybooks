const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");
const User = mongoose.model("users");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// stories index
router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .then(stories => {
      return res.render("stories/index", { stories: stories });
    });
});

//add stories
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

// edit stories
router.get("/edit/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate("user")
    .then(story => {
      res.render("stories/edit", { story: story });
    });
});

router.get("/show/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate("user")
    .then(story => {
      res.render("stories/show", { story: story });
    });
});

// process stories post request
router.post("/", (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };

  new Story(newStory)
    .save()
    .then(story => {
      return res.redirect(`/stories/show/${story.id}`);
    })
    .catch(error => {
      throw error;
    });
});

//edit story
router.put("/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    //new values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save().then(story => {
      res.redirect("/dashboard");
    });
  });
});

// delete story
router.delete("/:id", (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

module.exports = router;
