"use client";

interface DataTableProps {
  topCategories: {
    categoryName: string;
    jobCount: number;
    applicationCount: number;
  }[];
}

export default function DataTable({ topCategories }: DataTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Category Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Rank
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Category
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Jobs Posted
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Applications
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">
                Avg Apps/Job
              </th>
            </tr>
          </thead>
          <tbody>
            {topCategories.map((category, index) => {
              const avgApps =
                category.jobCount > 0
                  ? (category.applicationCount / category.jobCount).toFixed(1)
                  : "0";
              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {category.categoryName}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {category.jobCount}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">
                    {category.applicationCount}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {avgApps}
                    </span>
                  </td>
                </tr>
              );
            })}
            {topCategories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No data available for this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
