interface QuickStatsProps {
  dashboardData: {
    totalJobs: number;
    totalApplications: number;
    activeJobs: number;
  };
}

export default function QuickStats({ dashboardData }: QuickStatsProps) {
  const avgApplicationsPerJob =
    dashboardData.totalJobs > 0
      ? (dashboardData.totalApplications / dashboardData.totalJobs).toFixed(1)
      : "0";

  const activeJobsPercentage =
    dashboardData.totalJobs > 0
      ? ((dashboardData.activeJobs / dashboardData.totalJobs) * 100).toFixed(1)
      : "0";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Quick Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <p className="text-sm text-gray-600">Avg Applications per Job</p>
          <p className="text-2xl font-bold text-gray-900">
            {avgApplicationsPerJob}
          </p>
        </div>
        <div className="border-l-4 border-green-500 pl-4">
          <p className="text-sm text-gray-600">Active Jobs Rate</p>
          <p className="text-2xl font-bold text-gray-900">
            {activeJobsPercentage}%
          </p>
        </div>
        <div className="border-l-4 border-purple-500 pl-4">
          <p className="text-sm text-gray-600">Total Engagements</p>
          <p className="text-2xl font-bold text-gray-900">
            {(
              dashboardData.totalJobs + dashboardData.totalApplications
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
