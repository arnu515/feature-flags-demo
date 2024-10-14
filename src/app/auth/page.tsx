import { getUser } from "@/lib/session";
import AuthForm from "./form";

export default async function Auth() {
  const user = await getUser();
  return (
    <div className="fixed w-full h-full left-0 top-0 flex justify-center mt-20 p-4">
      <AuthForm username={user?.username} />
    </div>
  );
}
