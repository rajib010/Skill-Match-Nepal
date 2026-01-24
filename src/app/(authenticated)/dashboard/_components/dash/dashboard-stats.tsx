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
      color: "#3b82f6",
    },
    {
      icon: Users,
      title: "Total Applications",
      value: dashboardData.totalApplications,
      change: dashboardData.applicationsGrowth,
      color: "#8b5cf6",
    },
    {
      icon: TrendingUp,
      title: "New Users",
      value: dashboardData.totalUsers,
      change: dashboardData.usersGrowth,
      color: "#10b981",
    },
    {
      icon: CheckCircle,
      title: "Active Jobs",
      value: dashboardData.activeJobs,
      change: applicationSuccessRate.successRate,
      color: "#f59e0b",
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
  color,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  value: number;
  change: number;
  color: string;
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
          <p
            className={`text-sm mt-2 flex items-center ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {change >= 0 ? "+" : ""}
            {change}% vs last period
          </p>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
