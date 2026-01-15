import { getSignedInUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import ProfileClient from "./_components/profile-client";
import { getUserDetail } from "./actions";

export default async function ProfilePage() {
  const session = await getSignedInUser();

  if (!session?.id) {
    redirect("/login");
  }

  const res = await getUserDetail(session.id);

  const user = res.success ? res.data : {};

  if (!user) {
    redirect("/login");
  }

  return <ProfileClient user={user} />;
}
