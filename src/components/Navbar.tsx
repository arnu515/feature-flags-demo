import { getUser } from "@/lib/session";

export default async function Navbar() {
  const user = await getUser();
  return (
    <nav className="flex items-center justify-between mx-4 py-2 border-gray-500 my-4 text-lg max-w-screen-md md:mx-auto">
      <a href="/">(Not) Twitter</a>
      {user ? (
        <a className="font-bold" href={`/@${user.username}`}>
          @{user.username}
        </a>
      ) : (
        <a className="btn" href="/auth">
          Sign up
        </a>
      )}
    </nav>
  );
}
