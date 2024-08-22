import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Home, IUser, getUsers } from "../src/app/page";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock("../src/app/page", () => ({
  getUsers: jest.fn(),
  Home: jest.fn(),
}));

const mockUsers: IUser[] = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    firstname: "Jane",
    lastname: "Smith",
    email: "jane@example.com",
    phone: "098-765-4321",
  },
];

describe("Home component", () => {
  beforeEach(() => {
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);
    (Home as jest.Mock).mockImplementation(() => {
      return Promise.resolve(
        <div>
          <h1>Home Page</h1>
          <a href='/search'>Go to Search Page</a>
          <ul>
            {mockUsers.map((user: IUser) => (
              <li key={user.id}>
                <h1>
                  {user.firstname} {user.lastname}
                </h1>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <a href={`/details/${user.id}`}>more..........</a>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  });

  it("renders the home page title", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders a link to the search page", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);
    const searchLink = screen.getByText("Go to Search Page");
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute("href", "/search");
  });

  it("renders a list of users", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    await waitFor(() => {
      mockUsers.forEach((user) => {
        expect(
          screen.getByText(`${user.firstname} ${user.lastname}`)
        ).toBeInTheDocument();
        expect(screen.getByText(`Email: ${user.email}`)).toBeInTheDocument();
        expect(screen.getByText(`Phone: ${user.phone}`)).toBeInTheDocument();
      });
    });
  });

  it('renders "more" links for each user', async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    await waitFor(() => {
      mockUsers.forEach((user) => {
        const moreLink = screen.getByText("more..........", {
          selector: `a[href="/details/${user.id}"]`,
        });
        expect(moreLink).toBeInTheDocument();
      });
    });
  });

  it("handles error when fetching users fails", async () => {
    (getUsers as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch users")
    );
    (Home as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error("Failed to fetch users"));
    });

    await expect(Home()).rejects.toThrow("Failed to fetch users");
  });
});
