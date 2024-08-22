import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SearchPage, { generateStaticParams } from "../src/app/search/page";
import { IUser } from "../src/app/page";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

global.fetch = jest.fn();

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
  {
    id: 3,
    firstname: "Bob",
    lastname: "Johnson",
    email: "bob@example.com",
    phone: "111-222-3333",
  },
];

describe("Search Integration", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUsers),
    });
  });

  it("renders the search page with all users initially", async () => {
    const { container } = render(await SearchPage());

    await waitFor(() => {
      expect(screen.getByText("User Search")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search by firstname...")
      ).toBeInTheDocument();
      expect(screen.getByText("John (John)")).toBeInTheDocument();
      expect(screen.getByText("Jane (Jane)")).toBeInTheDocument();
      expect(screen.getByText("Bob (Bob)")).toBeInTheDocument();
    });
  });

  it("filters users based on search input", async () => {
    const { container } = render(await SearchPage());

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search by firstname...");
      fireEvent.change(searchInput, { target: { value: "jo" } });

      expect(screen.getByText("John (John)")).toBeInTheDocument();
      expect(screen.queryByText("Jane (Jane)")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob (Bob)")).not.toBeInTheDocument();
    });
  });

  it('displays "No users found" when search has no results', async () => {
    const { container } = render(await SearchPage());

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Search by firstname...");
      fireEvent.change(searchInput, { target: { value: "xyz" } });

      expect(screen.getByText("No users found.")).toBeInTheDocument();
    });
  });

  it("renders user links correctly", async () => {
    const { container } = render(await SearchPage());

    await waitFor(() => {
      const johnLink = screen.getByText("John (John)");
      expect(johnLink).toHaveAttribute("href", "/details/1");

      const janeLink = screen.getByText("Jane (Jane)");
      expect(janeLink).toHaveAttribute("href", "/details/2");
    });
  });

  it("fetches users data correctly", async () => {
    const users = await generateStaticParams();

    expect(users).toEqual(mockUsers);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.org/users"
    );
  });

  it("handles error when fetching users fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch users")
    );

    await expect(generateStaticParams()).rejects.toThrow(
      "Failed to fetch users"
    );
  });
});
