import Link from "next/link";

export async function getUsers() {
  const res = await fetch("https://jsonplaceholder.org/users", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export default async function Home() {
  const users = await getUsers();

  return (
    <div>
      <h1>Home Page</h1>
      <Link href='/search'>Go to Search Page</Link>

      <ul>
        {users.map((user: IUser) => (
          <li key={user.id} className='border-1 my-3 border border-red-300 p-2'>
            <h1 className='text-3xl'>
              {user.firstname} {user.lastname}
            </h1>
            <p className='text-2xl'>Email: {user.email}</p>
            <p className='text-2xl'>Phone: {user.phone}</p>
            <Link href={`/details/${user.id}`}>more..........</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
