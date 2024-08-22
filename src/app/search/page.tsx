import Link from "next/link";
import SearchComponent from "./SearchComponent";
import { IUser } from "../page";

interface SearchPageProps {
  users: IUser[];
}

export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.org/users");
  const users: IUser[] = await res.json();
  return users;
}

export default async function SearchPage() {
  const users = await generateStaticParams();

  return <SearchComponent users={users} />;
}
