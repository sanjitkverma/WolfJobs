import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import ResumeManagerViewer from "./ResumeManagerViewer";
import { act } from "react-dom/test-utils";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ResumeManagerViewer", () => {
    const mockResumeId = "123";
    const mockResumeBlob = new Blob(["mock resume content"], { type: "application/pdf" });
    const mockResumeUrl = URL.createObjectURL(mockResumeBlob);

    beforeEach(() => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockResumeBlob });
        jest.spyOn(URL, "createObjectURL").mockReturnValue(mockResumeUrl);
        jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", async () => {
        await act(async () => {
            render(
                <Router>
                    <ResumeManagerViewer />
                </Router>
            );
        });
        expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();
    });

    it("fetches and displays the resume", async () => {
        await act(async () => {
            render(
                <Router>
                    <ResumeManagerViewer />
                </Router>
            );
        });

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `http://localhost:8000/users/resume/${mockResumeId}`,
                { responseType: "blob" }
            );
        });

        expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();
    });

    it("navigates to the next and previous pages", async () => {
        await act(async () => {
            render(
                <Router>
                    <ResumeManagerViewer />
                </Router>
            );
        });

        const nextButton = screen.getByText("Next");
        const prevButton = screen.getByText("Previous");

        // Initially on page 1
        expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();

        // Go to next page
        fireEvent.click(nextButton);
        expect(screen.getByText(/Page 2 of/i)).toBeInTheDocument();

        // Go to previous page
        fireEvent.click(prevButton);
        expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();
    });

    it("disables previous button on the first page", async () => {
        await act(async () => {
            render(
                <Router>
                    <ResumeManagerViewer />
                </Router>
            );
        });

        const prevButton = screen.getByText("Previous");
        expect(prevButton).toBeDisabled();
    });

    it("disables next button on the last page", async () => {
        await act(async () => {
            render(
                <Router>
                    <ResumeManagerViewer />
                </Router>
            );
        });

        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton); // Move to page 2
        fireEvent.click(nextButton); // Move to page 3 (assuming 3 pages total)

        expect(nextButton).toBeDisabled();
    });
});