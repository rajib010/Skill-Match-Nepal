"use server";

import { prisma } from "@/database/prisma";
type TimePeriod = "weekly" | "monthly" | "yearly";

interface DashboardData {
  totalJobs: number;
  totalApplications: number;
  totalUsers: number;
  activeJobs: number;
  newJobs: number;
  newApplications: number;
  newUsers: number;
  jobsGrowth: number;
  applicationsGrowth: number;
  usersGrowth: number;
  chartData: {
    label: string;
    jobs: number;
    applications: number;
    users: number;
    date: Date;
  }[];
}

interface ApplicationStatusData {
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
}

interface TopCategoriesData {
  categoryName: string;
  jobCount: number;
  applicationCount: number;
}

// Helper function to get date ranges
function getDateRange(period: TimePeriod) {
  const now = new Date();
  const ranges: {
    start: Date;
    end: Date;
    previousStart: Date;
    previousEnd: Date;
  } = {
    start: new Date(),
    end: now,
    previousStart: new Date(),
    previousEnd: new Date(),
  };

  switch (period) {
    case "weekly":
      // Current week (Sunday to Saturday)
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      ranges.start = startOfWeek;
      ranges.end = now;

      // Previous week
      ranges.previousEnd = new Date(startOfWeek);
      ranges.previousEnd.setMilliseconds(-1);
      ranges.previousStart = new Date(ranges.previousEnd);
      ranges.previousStart.setDate(ranges.previousEnd.getDate() - 6);
      ranges.previousStart.setHours(0, 0, 0, 0);
      break;

    case "monthly":
      // Current month (from 1st to now)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      ranges.start = startOfMonth;
      ranges.end = now;

      // Previous month
      ranges.previousEnd = new Date(startOfMonth);
      ranges.previousEnd.setMilliseconds(-1);
      ranges.previousStart = new Date(
        ranges.previousEnd.getFullYear(),
        ranges.previousEnd.getMonth(),
        1,
      );
      break;

    case "yearly":
      // Current year (from Jan 1 to now)
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      ranges.start = startOfYear;
      ranges.end = now;

      // Previous year
      ranges.previousEnd = new Date(startOfYear);
      ranges.previousEnd.setMilliseconds(-1);
      ranges.previousStart = new Date(ranges.previousEnd.getFullYear(), 0, 1);
      break;
  }

  return ranges;
}

// Main dashboard data function
export async function getDashboardData(
  period: TimePeriod,
): Promise<DashboardData> {
  const { start, end, previousStart, previousEnd } = getDateRange(period);

  // Get current period data
  const [jobs, applications, users, activeJobs] = await Promise.all([
    prisma.job.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.jobApplication.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: {
          equals: "user",
          mode: "insensitive" as const,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.job.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  // Get previous period data for comparison
  const [prevJobs, prevApplications, prevUsers] = await Promise.all([
    prisma.job.count({
      where: {
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    }),
    prisma.jobApplication.count({
      where: {
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: {
          equals: "user",
          mode: "insensitive" as const,
        },
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    }),
  ]);

  // Calculate growth percentages
  const jobsGrowth = prevJobs > 0 ? ((jobs - prevJobs) / prevJobs) * 100 : 0;
  const applicationsGrowth =
    prevApplications > 0
      ? ((applications - prevApplications) / prevApplications) * 100
      : 0;
  const usersGrowth =
    prevUsers > 0 ? ((users - prevUsers) / prevUsers) * 100 : 0;

  // Generate chart data
  const chartData = await generateChartData(period, start, end);

  return {
    totalJobs: jobs,
    totalApplications: applications,
    totalUsers: users,
    activeJobs,
    newJobs: jobs,
    newApplications: applications,
    newUsers: users,
    jobsGrowth: Number(jobsGrowth.toFixed(2)),
    applicationsGrowth: Number(applicationsGrowth.toFixed(2)),
    usersGrowth: Number(usersGrowth.toFixed(2)),
    chartData,
  };
}

// Generate chart data based on period
async function generateChartData(
  period: TimePeriod,
  start: Date,
  end: Date,
): Promise<DashboardData["chartData"]> {
  const chartData: DashboardData["chartData"] = [];

  if (period === "weekly") {
    // Generate data for each day (Sun-Sat)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(start);
      dayStart.setDate(start.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [jobs, applications, users] = await Promise.all([
        prisma.job.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        }),
        prisma.jobApplication.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        }),
        prisma.user.count({
          where: {
            role: {
              equals: "user",
              mode: "insensitive" as const,
            },
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        }),
      ]);

      chartData.push({
        label: days[i],
        jobs,
        applications,
        users,
        date: dayStart,
      });
    }
  } else if (period === "monthly") {
    // Generate data for each week
    const currentDate = new Date(start);
    let weekNumber = 1;

    while (currentDate <= end) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      if (weekEnd > end) {
        weekEnd.setTime(end.getTime());
      }

      const [jobs, applications, users] = await Promise.all([
        prisma.job.count({
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        }),
        prisma.jobApplication.count({
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        }),
        prisma.user.count({
          where: {
            role: {
              equals: "user",
              mode: "insensitive" as const,
            },
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        }),
      ]);

      chartData.push({
        label: `Week ${weekNumber}`,
        jobs,
        applications,
        users,
        date: weekStart,
      });

      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }
  } else if (period === "yearly") {
    // Generate data for each month
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(start.getFullYear(), i, 1);
      const monthEnd = new Date(start.getFullYear(), i + 1, 0, 23, 59, 59, 999);

      // Skip future months
      if (monthStart > end) break;

      const actualEnd = monthEnd > end ? end : monthEnd;

      const [jobs, applications, users] = await Promise.all([
        prisma.job.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: actualEnd,
            },
          },
        }),
        prisma.jobApplication.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: actualEnd,
            },
          },
        }),
        prisma.user.count({
          where: {
            role: {
              equals: "user",
              mode: "insensitive" as const,
            },
            createdAt: {
              gte: monthStart,
              lte: actualEnd,
            },
          },
        }),
      ]);

      chartData.push({
        label: months[i],
        jobs,
        applications,
        users,
        date: monthStart,
      });
    }
  }

  return chartData;
}

// Get application status distribution
export async function getApplicationStatusData(
  period: TimePeriod,
): Promise<ApplicationStatusData> {
  const { start, end } = getDateRange(period);

  const statusCounts = await prisma.jobApplication.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const statusData: ApplicationStatusData = {
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  statusCounts.forEach((item) => {
    const status = item.status.toLowerCase() as keyof ApplicationStatusData;
    if (status in statusData) {
      statusData[status] = item._count.status;
    }
  });

  return statusData;
}

// Get top job categories
export async function getTopCategories(
  period: TimePeriod,
  limit: number = 5,
): Promise<TopCategoriesData[]> {
  const { start, end } = getDateRange(period);

  const categories = await prisma.category.findMany({
    include: {
      jobs: {
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        include: {
          applications: true,
        },
      },
    },
  });

  const categoryStats = categories
    .map((category) => ({
      categoryName: category.name,
      jobCount: category.jobs.length,
      applicationCount: category.jobs.reduce(
        (sum, job) => sum + job.applications.length,
        0,
      ),
    }))
    .filter((stat) => stat.jobCount > 0)
    .sort((a, b) => b.jobCount - a.jobCount)
    .slice(0, limit);

  return categoryStats;
}

// Get user growth metrics
export async function getUserGrowthMetrics(period: TimePeriod) {
  const { start, end, previousStart, previousEnd } = getDateRange(period);

  const [currentUsers, previousUsers, totalUsers] = await Promise.all([
    prisma.user.count({
      where: {
        role: {
          equals: "user",
          mode: "insensitive" as const,
        },
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: {
          equals: "user",
          mode: "insensitive" as const,
        },
        createdAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    }),
    prisma.user.count(),
  ]);

  const growthRate =
    previousUsers > 0
      ? ((currentUsers - previousUsers) / previousUsers) * 100
      : 0;

  return {
    currentPeriod: currentUsers,
    previousPeriod: previousUsers,
    growthRate: Number(growthRate.toFixed(2)),
    totalUsers,
  };
}

// Get job posting trends
export async function getJobPostingTrends(period: TimePeriod) {
  const { start, end } = getDateRange(period);

  const jobsByType = await prisma.job.groupBy({
    by: ["jobType"],
    _count: {
      jobType: true,
    },
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  return jobsByType.map((item) => ({
    type: item.jobType,
    count: item._count.jobType,
  }));
}

// Get application success rate
export async function getApplicationSuccessRate(period: TimePeriod) {
  const { start, end } = getDateRange(period);

  const [total, accepted] = await Promise.all([
    prisma.jobApplication.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
    prisma.jobApplication.count({
      where: {
        status: "accepted",
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    }),
  ]);

  const successRate = total > 0 ? (accepted / total) * 100 : 0;

  return {
    total,
    accepted,
    successRate: Number(successRate.toFixed(2)),
  };
}
