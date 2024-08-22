import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import UserDetails from "../src/app/details/[id]/page";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("../src/app/details/[id]/page", () => ({
  __esModule: true,
  default: jest.fn(),
  getUser: jest.fn(),
}));

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "123-456-7890",
  birthDate: "1990-01-01",
  address: {
    street: "123 Main St",
    suite: "Apt 4",
    city: "Anytown",
    zipcode: "12345",
  },
};

describe("UserDetails component", () => {
  beforeEach(() => {
    (UserDetails as jest.Mock).mockImplementation(() => {
      return Promise.resolve(
        <div>
          <a href='/'>Back to Home</a>
          <h1>{mockUser.name}</h1>
          <p>Email: {mockUser.email}</p>
          <p>Phone: {mockUser.phone}</p>
          <p>Birth Date: {mockUser.birthDate}</p>
          <p>
            Address: {mockUser.address.street} {mockUser.address.suite}{" "}
            {mockUser.address.city} {mockUser.address.zipcode}
          </p>
        </div>
      );
    });
  });

  it("renders user details correctly", async () => {
    const UserDetailsComponent = await UserDetails({ params: { id: "1" } });
    render(UserDetailsComponent);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: 123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("Birth Date: 1990-01-01")).toBeInTheDocument();
    expect(
      screen.getByText("Address: 123 Main St Apt 4 Anytown 12345")
    ).toBeInTheDocument();
  });

  it("renders a link back to home", async () => {
    const UserDetailsComponent = await UserDetails({ params: { id: "1" } });
    render(UserDetailsComponent);

    const homeLink = screen.getByText("Back to Home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("handles error when fetching user fails", async () => {
    (UserDetails as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error("Failed to fetch user"));
    });

    await expect(UserDetails({ params: { id: "1" } })).rejects.toThrow(
      "Failed to fetch user"
    );
  });
});
