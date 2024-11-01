const { createApplication } = require("../controllers/api/v1/users_api"); // Update with your actual path
const Application = require("../models/application"); // Update with your actual path
const User = require("../models/user"); // Update with your actual path

jest.mock("../models/application");
jest.mock("../models/user");

describe("createApplication", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        applicantId: "applicantId123",
        jobId: "jobId123",
        applicantname: "John Doe",
        applicantemail: "john@example.com",
        applicantskills: ["JavaScript", "Node.js"],
        skills: ["JavaScript", "Node.js"],
        address: "123 Main St",
        phonenumber: "555-555-5555",
        hours: "Full-time",
        dob: "1990-01-01",
        gender: "Male",
        jobname: "Software Developer",
        managerid: "managerId123",
      },
    };

    res = {
      set: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return error if application already exists", async () => {
    Application.findOne.mockResolvedValueOnce(true); // Mocking existing application

    await createApplication(req, res);

    expect(res.set).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "You have already applied for the job",
      error: true,
    });
  });

  it("should return error if user resume is not found", async () => {
    Application.findOne.mockResolvedValueOnce(null); // No existing application
    User.findOne.mockResolvedValueOnce(null); // Resume not found

    await createApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Resume not found in profile",
    });
  });

  it("should create an application successfully", async () => {
    const mockResume = { resumeId: "resumeId123" };
    const savedApplication = {
      applicantid: req.body.applicantId,
      jobid: req.body.jobId,
      resumeId: mockResume.resumeId,
    };

    Application.findOne.mockResolvedValueOnce(null); // No existing application
    User.findOne.mockResolvedValueOnce(mockResume); // Mocking resume found
    Application.mockImplementation(() => ({
      ...savedApplication,
      save: jest.fn().mockResolvedValueOnce(savedApplication), // Mock save method to resolve with the application object
    }));

    await createApplication(req, res);

    expect(res.set).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        application: expect.objectContaining(savedApplication), // Ensure it matches the saved application
      },
    });
  });

  it("should handle internal server error", async () => {
    Application.findOne.mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    await createApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
