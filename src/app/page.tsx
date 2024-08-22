import Link from "next/link";

export default async function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href='/search'>Go to Search Page</Link>
    </div>
  );
}
