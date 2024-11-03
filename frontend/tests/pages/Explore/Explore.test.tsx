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

  test("Check if explore renders", async () => {

    mock.onGet("http://localhost:8000/api/v1/users/skills")
      .reply(200, {
        skills: ["leadership", "communication", "team management"]
      });

    <MemoryRouter>
      render(<Explore />);
      const autocompleteInput = screen.getByPlaceholderText('Select Skills');

      // Simulate clicking or focusing on the input to open the dropdown
      fireEvent.mouseDown(autocompleteInput);

      // Get all the rendered options
      const options = screen.getAllByRole('option');

      // Check the number of options
      expect(options.length).toBe(3);
    </MemoryRouter>
  });

  test("Test skills autocomplete widget", async () => {

    mock.onGet("http://localhost:8000/api/v1/users/skills")
      .reply(200, {
        skills: ["leadership", "communication", "team management"]
      });

    <MemoryRouter>
      render(<Explore />);
      const autocompleteInput = screen.getByPlaceholderText('Select Skills');

      // Simulate clicking or focusing on the input to open the dropdown
      fireEvent.mouseDown(autocompleteInput);

      // Get all the rendered options
      const options = screen.getAllByRole('option');

      // Check the number of options
      expect(options.length).toBe(3);
    </MemoryRouter>
  });

  test('checks all affiliation options in dropdown', async () => {
    <MemoryRouter>
      render(<Explore />);

      // Find the affiliation dropdown
      const dropdown = screen.getByLabelText(/Select Affiliation/i);

      // Open the dropdown
      fireEvent.mouseDown(dropdown);

      // Check each option exists in the dropdown
      const option1 = screen.getByText('NC State Dining');
      const option2 = screen.getByText('Campus Enterprises');
      const option3 = screen.getByText('Wolfpack Outfitters');

      // Assert that the options are rendered
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
      expect(option3).toBeInTheDocument();
    </MemoryRouter>
  });

  test('check sort by score', async () => {
    const user = {
      email: "mock@mail.com", name: "mock name", role: "Applicant", skills: ["teamwork", "leadership", "scheduling"]
    };

    mock.onGet("http://localhost:8000/api/v1/users").reply(200, {
      jobs: [
        {
          _id: "1",
          title: "Mock_Job 1",
          requiredSkills: ["teamwork", "communication", "leadership"],
          status: 'open',
          managerAffilication: 'wolfpack-outfitters'
        },

        {
          _id: "2",
          title: "Mock_Job 2",
          requiredSkills: ["inventory management", "leadership", "budget management"],
          status: 'open',
          managerAffilication: 'campus-enterprises'
        },

        {
          _id: "3",
          title: "Mock_Job 3",
          requiredSkills: ["leadership", "scheduling"],
          status: 'open',
          managerAffilication: 'wolfpack-outfitters'
        }
      ],
    });

    mock.onPost("http://localhost:8000/api/v1/users/create-session").reply(200, {
      data: {
        token: "mock_token",
        user: user
      }
    });

    <MemoryRouter>
      render(<Explore />);
      let jobItems = screen.getAllByText(/Job/);

      expect(jobItems.length).toBe(2);
    </MemoryRouter>
  })
});
