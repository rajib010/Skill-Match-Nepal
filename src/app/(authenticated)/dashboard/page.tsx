// app/dashboard/page.tsx
import { getSignedInUser } from "@/lib/auth/server";
import { notFound, redirect } from "next/navigation";
import {
  getDashboardData,
  getApplicationStatusData,
  getTopCategories,
  getUserGrowthMetrics,
  getJobPostingTrends,
  getApplicationSuccessRate,
} from "./actions";
import TimeFilterTabs from "./_components/dash/time-filter-tabs";
import DashboardStats from "./_components/dash/dashboard-stats";
import DashboardCharts from "./_components/dash/dashboard-charts";
import MetricsOverview from "./_components/dash/metrics-overview";
import QuickStats from "./_components/dash/quick-stats";
import DataTable from "./_components/dash/data-table";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

type TimePeriod = "weekly" | "monthly" | "yearly";

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

  const user = await getSignedInUser();

  if (!user) {
    return notFound();
  }

  // Only admins can access dashboard
  if (user.role !== "admin") {
    redirect("/");
  }

  // Get filter from search params
  const filter = resolvedSearchParams.filter;
  const timePeriod: TimePeriod =
    typeof filter === "string" &&
    ["weekly", "monthly", "yearly"].includes(filter)
      ? (filter as TimePeriod)
      : "yearly";

  // Fetch all data in parallel
  const [
    dashboardData,
    applicationStatus,
    topCategories,
    userGrowthMetrics,
    jobPostingTrends,
    applicationSuccessRate,
  ] = await Promise.all([
    getDashboardData(timePeriod),
    getApplicationStatusData(timePeriod),
    getTopCategories(timePeriod, 5),
    getUserGrowthMetrics(timePeriod),
    getJobPostingTrends(timePeriod),
    getApplicationSuccessRate(timePeriod),
  ]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your job portal performance and metrics
            </p>
          </div>
        </div>

        {/* Time Filter Tabs */}
        <TimeFilterTabs currentFilter={timePeriod} />

        {/* Stats Cards */}
        <DashboardStats
          dashboardData={dashboardData}
          userGrowthMetrics={userGrowthMetrics}
          applicationSuccessRate={applicationSuccessRate}
        />

        {/* Metrics Overview */}
        <MetricsOverview
          applicationSuccessRate={applicationSuccessRate}
          userGrowthMetrics={userGrowthMetrics}
          timePeriod={timePeriod}
        />

        {/* Quick Stats */}
        <QuickStats dashboardData={dashboardData} />

        {/* Charts */}
        <DashboardCharts
          chartData={dashboardData.chartData}
          applicationStatus={applicationStatus}
          topCategories={topCategories}
          jobPostingTrends={jobPostingTrends}
          timePeriod={timePeriod}
        />

        {/* Data Table */}
        <DataTable topCategories={topCategories} />
      </div>
    </div>
  );
}
