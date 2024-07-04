const express = require("express");
const { NoteModel } = require("../models/notesModel");
const { auth } = require("../middleware/auth");

const noteRouter = express.Router();

noteRouter.post("/create", auth, async (req, res) => {
  try {
    let note = new NoteModel(req.body);
    await note.save();
    res.status(201).send({ msg: "Notes has been created!!" });
  } catch (error) {
    res.status(500).send({ msg: "Internal Server Error, Try again..." });
  }
});

noteRouter.get("/", auth, async (req, res) => {
  try {
    let note = await NoteModel.find({ userID: req.body.userID });
    if (note) {
      res.send(note);
    } else {
      res.status(400).send({ msg: "Please Create Notes!!" });
    }
  } catch (error) {
    res.send({ error: error });
  }
});

noteRouter.patch("/update/:noteID", auth, async (req, res) => {
  const { noteID } = req.params;
  try {
    const note = await NoteModel.findOne({
      _id: noteID,
      userID: req.body.userID,
    });
    if (!note) {
      res.status(401).send({ msg: "User is not authorized" });
    } else {
      await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body);
      res.status(200).send({ msg: "Notes has been updated!!" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Internal Server Error, Try again!!" });
  }
});

noteRouter.delete("/delete/:noteID", auth, async (req, res) => {
  const { noteID } = req.params;
  try {
    const note = await NoteModel.findOne({
      _id: noteID,
      userID: req.body.userID,
    });
    if (!note) {
      res.status(401).send({ msg: "User is not authorized" });
    } else {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.status(200).send({ msg: "Notes has been deleted!!" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Internal Server Error, Try again!!" });
  }
});

module.exports = { noteRouter };
