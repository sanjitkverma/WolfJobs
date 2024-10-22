const emailService = require('../models/email');
const updateApplicationStatus = async (req, res) => {
    const { applicationId, status } = req.body;
  
    try {
      const application = await User.findOne({ _id: applicationId });
      if (!application) {
        return res.status(404).send({ error: 'Application not found' });
      }
  
      application.status = status;
      await application.save();
  
      // Notify the applicant
      const applicant = await User.findById(application.applicantId);
      const subject = `Your application has been reviewed`;
      const text = `Dear ${applicant.name},\n\nYour application for the position has been ${status}.\n\nBest regards,\nYour Company`;
  
      await emailService.sendEmailNotification(applicant.email, subject, text);
  
      res.status(200).send({ message: 'Application status updated and notification sent' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };
  module.exports = { updateApplicationStatus };