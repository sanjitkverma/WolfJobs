// controllers/resume_controller.js
const Resume = require("../models/resume");
const User = require("../models/user");
const Application = require("../models/application");

const multer = require("multer");

const upload = multer({
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Please upload a PDF file"));
    }
    cb(undefined, true);
  },
});

// Resume upload handler
exports.uploadResume = async (req, res) => {
  let user = await User.findOne({ _id: req.body.id });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  try {
    const resume = new Resume({
      applicantId: user._id, // Assuming the user is authenticated
      fileName: req.file.originalname,
      fileData: req.file.buffer,
      contentType: "application/pdf",
    });
    await resume.save();

    // update the user's resumeId
    user.resumeId = resume._id;
    user.resume = resume.fileName;
    await user.save();

    res.status(201).send({ message: "Resume uploaded successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const resume = await Resume.findOne({ _id: user.resumeId });
    if (!resume) {
      return res.status(404).send({ error: "Resume not found" });
    }
    res.set("Content-Type", "application/pdf");
    // send file name
    res.set("Content-Disposition", `inline; filename=${resume.fileName}`);
    res.send(resume.fileData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Make sure to export the multer upload as well
exports.upload = upload;

exports.ping = (req, res) => {
  res.send({ message: "Pong" });
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id });
    if (!resume) {
      return res.status(404).send({ error: "Resume not found" });
    }
    res.set("Content-Type", "application/pdf");
    // send file name
    res.set("Content-Disposition", `inline; filename=${resume.fileName}`);
    res.send(resume.fileData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Make sure to export the multer upload as well
exports.upload = upload;

exports.ping = (req, res) => {
  res.send({ message: "Pong" });
};
