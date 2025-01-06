import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

global.fetch = jest.fn();

const mockProjects = [
  {
    "s.no": 0,
    "amt.pledged": 15823,
    blurb: "Test project 1",
    by: "Creator 1",
    country: "US",
    currency: "usd",
    "end.time": "2016-11-01T23:59:00-04:00",
    location: "Washington, DC",
    "percentage.funded": 186,
    "num.backers": "219382",
    state: "DC",
    title: "Project 1",
    type: "Town",
    url: "/projects/1",
  },
  {
    "s.no": 1,
    "amt.pledged": 5000,
    blurb: "Test project 2",
    by: "Creator 2",
    country: "US",
    currency: "usd",
    "end.time": "2016-11-01T23:59:00-04:00",
    location: "New York, NY",
    "percentage.funded": 100,
    "num.backers": "100000",
    state: "NY",
    title: "Project 2",
    type: "Town",
    url: "/projects/2",
  },
];

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("displays data fetched from API", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: mockProjects }),
    });

    render(<App />);

    expect(screen.getByText(/Kickstarter Projects/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Project 1")).toBeInTheDocument());
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.getByText("186%")).toBeInTheDocument();
    expect(screen.getByText("$15,823")).toBeInTheDocument();
  });

  test("displays error message when API call fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<App />);

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument());
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  test("pagination works correctly", async () => {
    const largeMockProjects = Array.from({ length: 10 }, (_, i) => ({
      ...mockProjects[0],
      "s.no": i,
      title: `Project ${i + 1}`,
    }));

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: largeMockProjects }),
    });

    render(<App />);

    await waitFor(() => expect(screen.getByText("Project 1")).toBeInTheDocument());
    expect(screen.queryByText("Project 6")).not.toBeInTheDocument();

    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => expect(screen.getByText("Project 6")).toBeInTheDocument());
    expect(screen.queryByText("Project 1")).not.toBeInTheDocument();
  });

  test("retry button reloads the page", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<App />);

    await waitFor(() => expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument());

    const retryButton = screen.getByRole("button", { name: /Retry/i });
    const reloadSpy = jest.spyOn(window.location, "reload").mockImplementation(() => {});

    fireEvent.click(retryButton);
    expect(reloadSpy).toHaveBeenCalled();
    reloadSpy.mockRestore();
  });
});
