import Link from "next/link";
import { IUser } from "@/app/page";

async function getUser(id: string) {
  const res = await fetch(`https://jsonplaceholder.org/users/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export default async function UserDetails({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  return (
    <div className='p-4'>
      <Link
        href='/'
        className='mb-4 inline-block text-blue-500 hover:underline'
      >
        Back to Home
      </Link>
      <h1 className='mb-4 text-3xl font-bold'>{user.name}</h1>
      <p className='mb-2 text-xl'>Email: {user.email}</p>
      <p className='mb-2 text-xl'>Phone: {user.phone}</p>
      <p className='mb-2 text-xl'>Birth Date: {user.birthDate}</p>
      <p className='mb-2 text-xl'>
        Address: {user.address?.street} {user.address?.suite}{" "}
        {user.address?.city} {user.address?.zipcode}
      </p>
    </div>
  );
}
