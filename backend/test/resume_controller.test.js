const { getResumeById } = require("../controllers/resume_controller"); // Update with your actual path
const Resume = require("../models/resume"); // Update with your actual path

jest.mock("../models/resume");

describe("getResumeById", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "resumeId123",
      },
    };

    res = {
      set: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it("should return a 404 error if resume is not found", async () => {
    Resume.findOne.mockResolvedValueOnce(null); // Mocking no resume found

    await getResumeById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ error: "Resume not found" });
  });

  it("should return the resume successfully", async () => {
    const mockResume = {
      fileName: "resume.pdf",
      fileData: Buffer.from("mock file data"),
    };

    Resume.findOne.mockResolvedValueOnce(mockResume); // Mocking found resume

    await getResumeById(req, res);

    expect(res.set).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(res.set).toHaveBeenCalledWith(
      "Content-Disposition",
      `inline; filename=${mockResume.fileName}`
    );
    expect(res.send).toHaveBeenCalledWith(mockResume.fileData);
  });

  it("should handle errors and return a 400 status", async () => {
    const mockError = new Error("Database error");
    Resume.findOne.mockImplementationOnce(() => {
      throw mockError; // Simulate an error
    });

    await getResumeById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
  });
});
