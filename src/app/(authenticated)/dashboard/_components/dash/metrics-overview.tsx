interface MetricsOverviewProps {
  applicationSuccessRate: {
    total: number;
    accepted: number;
    successRate: number;
  };
  userGrowthMetrics: {
    currentPeriod: number;
    previousPeriod: number;
    growthRate: number;
    totalUsers: number;
  };
  timePeriod: string;
}

export default function MetricsOverview({
  applicationSuccessRate,
  userGrowthMetrics,
  timePeriod,
}: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Success Rate Card */}
      <div className="rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Application Success Rate
          </h3>
          <div className="bg-green-500 text-white rounded-full p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-4xl font-bold text-green-600 mb-2">
          {applicationSuccessRate.successRate}%
        </div>
        <p className="text-sm text-gray-800">
          {applicationSuccessRate.accepted} out of{" "}
          {applicationSuccessRate.total} applications
        </p>
      </div>

      {/* User Growth Card */}
      <div className="rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
          <div className="bg-primary text-white rounded-full p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {userGrowthMetrics.growthRate >= 0 ? "+" : ""}
          {userGrowthMetrics.growthRate}%
        </div>
        <p className="text-sm text-gray-700">
          {userGrowthMetrics.currentPeriod} new users this {timePeriod}
        </p>
      </div>

      {/* Total Users Card */}
      <div className="rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <div className="bg-[#D4AF37] text-white rounded-full p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
        <div className="text-4xl font-bold text-[#D4AF37] mb-2">
          {userGrowthMetrics.totalUsers.toLocaleString()}
        </div>
        <p className="text-sm text-gray-700">Registered users on platform</p>
      </div>
    </div>
  );
}
