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
  // first look for a resume with the same applicantId
  const existingResume = await Resume.findOne({
    applicantId: req.body.id,
  });

  if (existingResume) {
    // delete the existing resume
    existingResume.remove();
  }

  // find the user and add the resume
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
    // Retrieve the application by ID to get the snapshot of the resume submitted with the application
    const application = await Application.findById(
      req.params.applicationId
    ).select("resumeSnapshot");

    if (!application || !application.resumeSnapshot) {
      return res
        .status(404)
        .send({ error: "Resume not found in this application." });
    }

    const { fileName, fileData, contentType } = application.resumeSnapshot;

    // Set headers for the PDF file and return the file data
    res.set("Content-Type", contentType);
    res.set("Content-Disposition", `inline; filename="${fileName}"`);
    res.send(fileData);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getApplicationResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application || !application.resumeSnapshot) {
      return res.status(404).send({ error: "Resume snapshot not found" });
    }
    res.set("Content-Type", application.resumeSnapshot.contentType);
    res.set(
      "Content-Disposition",
      `inline; filename=${application.resumeSnapshot.fileName}`
    );
    res.send(application.resumeSnapshot.fileData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
// Make sure to export the multer upload as well
exports.upload = upload;

exports.ping = (req, res) => {
  res.send({ message: "Pong" });
};
