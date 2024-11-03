import { render } from "@testing-library/react";
import LandingPage from "../../../src/Pages/Auth/landingPage";
import { MemoryRouter } from "react-router";

describe("LandingPage", () => {
  it("renders LandingPage", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    // const headline = screen.getByText(/Hello/i);
    // expect(headline).toBeInTheDocument();
  });
});
