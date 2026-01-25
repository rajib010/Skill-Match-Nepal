import { Briefcase, Users, TrendingUp, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  dashboardData: {
    totalJobs: number;
    totalApplications: number;
    totalUsers: number;
    activeJobs: number;
    jobsGrowth: number;
    applicationsGrowth: number;
    usersGrowth: number;
  };
  userGrowthMetrics: {
    growthRate: number;
  };
  applicationSuccessRate: {
    successRate: number;
  };
}

export default function DashboardStats({
  dashboardData,
  applicationSuccessRate,
}: DashboardStatsProps) {
  const stats = [
    {
      icon: Briefcase,
      title: "Total Jobs",
      value: dashboardData.totalJobs,
      change: dashboardData.jobsGrowth,
    },
    {
      icon: Users,
      title: "Total Applications",
      value: dashboardData.totalApplications,
      change: dashboardData.applicationsGrowth,
    },
    {
      icon: TrendingUp,
      title: "Total Users",
      value: dashboardData.totalUsers,
      change: dashboardData.usersGrowth,
    },
    {
      icon: CheckCircle,
      title: "Active Jobs",
      value: dashboardData.activeJobs,
      change: applicationSuccessRate.successRate,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  change,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  value: number;
  change: number;
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: "primary" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
          <p
            className={`text-sm mt-2 items-center p-2 w-18 max-w-sm rounded-sm  ${
              change === 0
                ? "text-gray-500 bg-gray-100"
                : change > 0
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
            }`}
          >
            {change} %
          </p>
        </div>
        <div className="p-3 rounded-full bg-primary">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}
