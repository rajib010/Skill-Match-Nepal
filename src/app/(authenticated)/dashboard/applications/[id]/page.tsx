import { getSignedInUser } from "@/lib/auth/server";
import { notFound, redirect } from "next/navigation";
import { getApplicationDetail } from "../actions";
import ApplicationDetailView from "../_components/application-detail-view";
import GoBackButton from "../../_components/go-back-button";

interface ApplicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params;

  const user = await getSignedInUser();

  if (!user) {
    redirect("/login");
  }

  // Only admins can view application details
  if (user.role !== "admin") {
    redirect("/");
  }

  const res = await getApplicationDetail(id);

  if (!res.success) {
    return notFound();
  }

  const application = res.data;

  if (!application) {
    notFound();
  }

  return (
    <div className="min-h-screen">
        <GoBackButton url="/dashboard/applications"/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicationDetailView application={application} />
      </div>
    </div>
  );
}
