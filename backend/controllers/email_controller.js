const email = require('../models/email');
const Application = require('../models/application');
const User = require('../models/user');


const updateApplicationStatus = async (req, res) => {
    const { applicationId, status } = req.body;
  
    try {
      const application = await Application.findById({applicationId});
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      application.status = status;
      await application.save();
  
      // Notify the applicant
      const applicant = await User.findById(application.applicantid);
      const subject = `Your application has been reviewed`;
      const text = `Dear ${applicant.name},\n\nYour application for the position has been ${status}.\n\nBest regards,\nHiring Team`;
  
      try {
        await email.sendEmail(applicant._id, subject, text);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        return res.status(500).json({ message: 'Application status updated, but failed to send email notification' });
      }  
      res.status(200).json({ message: 'Application status updated and notification sent' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = {
    updateApplicationStatus,
  };