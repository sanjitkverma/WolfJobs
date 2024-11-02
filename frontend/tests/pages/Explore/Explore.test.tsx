import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from "react";
import Explore from "../../../src/Pages/Explore/Explore";
import { MemoryRouter } from "react-router";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);


describe("Explore", () => {
  beforeEach(() => {
    // Clear prior mocks and configurations
    mock.reset();
  });

  test("Request for users by jobs", async () => {
    mock.onGet("http://localhost:8000/api/v1/users").reply(200, {
      jobs: [
        { _id: "1", title: "Job 1" },
        { _id: "2", title: "Job 2" },
      ],
    });
    <MemoryRouter>
      render(
      <Explore />
      );
    </MemoryRouter>;
  });

  test("Request for users by jobs1", async () => {
    mock.onGet("http://localhost:8000/api/v1/users").reply(200, {
      jobs: [
        { _id: "1", title: "Job 1" },
        { _id: "3", title: "Job 3" },
      ],
    });
    <MemoryRouter>
      render(
      <Explore />
      );
    </MemoryRouter>;
  });

  test("Request for applications", async () => {
    // Mock successful API response for fetching applications
    mock
      .onGet("http://localhost:8000/api/v1/users/fetchapplications")
      .reply(200, {
        application: [{ _id: "1", jobid: "123", status: "applied" }],
      });

    <MemoryRouter>            
      render(
      <Explore />
      );
    </MemoryRouter>;
  });

  test("Request for applications", async () => {
    // Mock successful API response for fetching applications
    mock
      .onGet("http://localhost:8000/api/v1/users/fetchapplications")
      .reply(200, {
        application: [{ _id: "2", jobid: "321", status: "In Review" }],
      });

    <MemoryRouter>
      render(
      <Explore />
      );
    </MemoryRouter>;
  });


  test("Filter by location", async () => {
    // Mock successful API response for filtering by location
    mock.onGet("http://localhost:8000/api/v1/users").reply(200, {
      application: [
        { _id: "1", name: "Software engineer", jobid: "123", type: "full-time", location: "Cary", status: "open" },
        { _id: "2", name: "Data Analyst", jobid: "547", type: "part-time", location: "Durham", status: "open" },
      ],
    });
  
    // Render the Explore component within MemoryRouter
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );
  
    // Locate and click the Filters button
    const filtersButton = screen.getByText("Filters");
    fireEvent.click(filtersButton);
  
    // Locate and set the location filter input field
    const filterLocationInput = screen.getByPlaceholderText("Enter location");
    fireEvent.change(filterLocationInput, { target: { value: "Raleigh" } });
  
    // Apply the filters by clicking "Apply Filters" button
    const applyFiltersButton = screen.getByText("Apply Filters");
    fireEvent.click(applyFiltersButton);
  
    // Assertion to ensure only the filtered job (Raleigh) is displayed
    
    
    expect(screen.queryByText("Software engineer")).not.toBeInTheDocument(); // Expect this job to not be present
    expect(screen.queryByText("Data Analyst")).not.toBeInTheDocument(); // Expect this job to not be present
  });

test("Filter by Employment-type", async () => {
  // Mock successful API response for fetching applications
  mock
    .onGet("http://localhost:8000/api/v1/users/fetchapplications")
    .reply(200, {
      application: [{ _id: "2", jobid: "321", status: "In Review" }],
    });

  <MemoryRouter>
    render(
    <Explore />
    );
  </MemoryRouter>;

await waitFor(() => {
  expect(screen.getByText(/filters/i)).toBeInTheDocument(); // Assert that the Filters button is in the document
});

const filtersButton = await screen.findByText(/filters/i);
  fireEvent.click(filtersButton);

  // Locate and select the employment type filter dropdown
  const employmentTypeSelect = screen.getByLabelText(/employment type/i);
  fireEvent.change(employmentTypeSelect, { target: { value: "part-time" } });

  // Apply the filters by clicking "Apply Filters" button
  const applyFiltersButton = screen.getByText(/apply filters/i);
  fireEvent.click(applyFiltersButton);

  // Assertions to ensure filtered results are correct
  expect(screen.queryByText("Software Engineer")).not.toBeInTheDocument(); // This should not be visible
  expect(screen.getByText("Data Analyst")).toBeInTheDocument(); 
});

  });
  



