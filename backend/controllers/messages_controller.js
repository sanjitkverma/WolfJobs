const Message = require("../models/message");
const isUndefinedOrEmpty = require("../utils/common") 

module.exports.createMessage = async function (req, res) {
  if (isUndefinedOrEmpty(req.body.fromUser) || isUndefinedOrEmpty(req.body.toUser) || isUndefinedOrEmpty(req.body.message) || isUndefinedOrEmpty(req.body.applicationId)) {
    return res.status(400).send({message: `Required fields missing`});
  }
  const doc = new Message(req.body);
  try {
    await doc.save();
    res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.error(`Message: ${req.body} not created due to error: ${error}`);
    res.status(500).send({ message: `Something went wrong` });
  }
};

module.exports.fetchMessages = async function (req, res) {
  const applicationId = req.query.applicationId;
  if (applicationId === undefined || applicationId.trim() === "") {
    return res.status(400).send({ message: "applicationId missing" });
  }

  try {
    const docs = await Message.find({ applicationId: applicationId });
    const data = docs.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    res.send({ data: data });
  } catch (error) {
    console.error(`Message: ${req.body} not fetched due to error: ${error}`);
    res.status(500).send({ message: `Something went wrong` });
  }
};
