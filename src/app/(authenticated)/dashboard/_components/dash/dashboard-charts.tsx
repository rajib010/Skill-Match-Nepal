"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartsProps {
  chartData: {
    label: string;
    jobs: number;
    applications: number;
    users: number;
  }[];
  applicationStatus: {
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
  topCategories: {
    categoryName: string;
    jobCount: number;
    applicationCount: number;
  }[];
  jobPostingTrends: {
    type: string;
    count: number;
  }[];
  timePeriod: string;
}

export default function DashboardCharts({
  chartData,
  applicationStatus,
  topCategories,
  jobPostingTrends,
}: DashboardChartsProps) {
  const statusData = [
    { name: "Pending", value: applicationStatus.pending, color: "#fbbf24" },
    { name: "Reviewed", value: applicationStatus.reviewed, color: "#3B82C6" },
    { name: "Accepted", value: applicationStatus.accepted, color: "#34d399" },
    { name: "Rejected", value: applicationStatus.rejected, color: "#f87171" },
  ];

  const categoryData = topCategories.map((cat) => ({
    category: cat.categoryName,
    jobs: cat.jobCount,
    applications: cat.applicationCount,
  }));

  return (
    <>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Jobs & Applications Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Jobs & Applications Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#3B82C6"
                strokeWidth={2}
                name="Jobs Posted"
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#D4AF37"
                strokeWidth={2}
                name="Applications"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Application Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#3B82C6"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            User Registration Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3B82C6" name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Top Job Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#3B82C6" name="Jobs" />
              <Bar dataKey="applications" fill="#D4AF37" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 - Job Posting Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Job Posting Trends by Type */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            Job Posting Trends by Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPostingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82C6" name="Job Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Job Type Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Job Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobPostingTrends}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) =>
                  `${type} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {jobPostingTrends.map((entry, index) => {
                  const colors = ["#3B82C6", "#10b981", "#f59e0b", "#ef4444"];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  );
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusData.map((status, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-4 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: status.color }}>
              {status.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">{status.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
