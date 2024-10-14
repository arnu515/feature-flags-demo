import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function GET(_: Request) {
  const ssn = await getSession();
  ssn.destroy();
  redirect("/");
}
