import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const isAuthenticated = cookies().get("user-logged")?.value;
  if (isAuthenticated) {
    redirect("/dashboard");
  }
  return redirect("/user/login");
}
