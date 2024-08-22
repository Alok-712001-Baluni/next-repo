"use client";
import { useState } from "react";
import Link from "next/link";
import { IUser } from "../page";

interface SearchComponentProps {
  users: IUser[];
}

const SearchComponent = ({ users }: SearchComponentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-3xl font-bold'>User Search</h1>
      <input
        type='text'
        placeholder='Search by firstname...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='mb-4 rounded border border-gray-300 p-2'
      />
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} className='mb-2'>
              <Link href={`/details/${user.id}`}>
                {user.firstname} ({user.firstname})
              </Link>
            </li>
          ))
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchComponent;
