import { ErrorDisplay } from "@/app/(authenticated)/dashboard/_components/error-display";
import { CategoriesType, getActiveJobs, getCategories } from "./actions";
import SearchInput from "@/app/(authenticated)/dashboard/_components/search-input";
import DropDownFilter from "@/app/(authenticated)/dashboard/_components/dropdown-filter";
import { UserJobCards } from "./_components/user-job-cards";
import { PaginationComponent } from "@/app/(authenticated)/dashboard/_components/pagination-component";
import { CategoryFilter } from "./_components/category-filter";
import { getSignedInUser } from "@/lib/auth/server";

interface iAppProps {
  searchParams: Promise<{ [key: string]: string | string[] | unknown }>;
}

const sortFields = [
  {
    label: "Match Score",
    key: "matchScore",
    options: {
      asc: "Lowest Match",
      desc: "Highest Match",
    },
  },
  {
    label: "Date Posted",
    key: "createdAt",
    options: {
      asc: "Oldest First",
      desc: "Newest First",
    },
  },
];

export default async function JobsPage({ searchParams }: iAppProps) {
  const resolvedParams = await searchParams;

  const limit = resolvedParams.limit ? Number(resolvedParams.limit) : 12;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
  const search =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;

  const sortOrder =
    resolvedParams.sort === "asc" || resolvedParams.sort === "desc"
      ? resolvedParams.sort
      : "desc";

  const sortField = ["createdAt", "matchScore"].includes(
    resolvedParams.sortField as string
  )
    ? (resolvedParams.sortField as "createdAt" | "matchScore")
    : "matchScore";

  const categoryId =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : undefined;

  const jobType =
    typeof resolvedParams.jobType === "string"
      ? resolvedParams.jobType
      : undefined;

  const location =
    typeof resolvedParams.location === "string"
      ? resolvedParams.location
      : undefined;

  const user = await getSignedInUser();
  const userId = user?.id;

  // Fetch jobs and categories in parallel
  const [jobsRes, categoriesRes] = await Promise.all([
    getActiveJobs(
      page,
      limit,
      search,
      sortField,
      sortOrder,
      categoryId,
      jobType,
      location,
      userId
    ),
    getCategories(),
  ]);

  if (!jobsRes.success) {
    return <ErrorDisplay message={jobsRes.message} />;
  }

  const {
    jobs,
    userHasSkills,
    userSkillsCount,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
  } = jobsRes.data;

  const categories: CategoriesType[] = categoriesRes.success
    ? categoriesRes.data
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className=" flex flex-wrap justify-end gap-3">
          <SearchInput />

          <CategoryFilter categories={categories || []} />

          {/* // <JobTypeFilter /> */}

          {/* Sort */}
          <DropDownFilter
            sortField={sortField}
            fields={sortFields}
            search={search}
            sortOrder={sortOrder}
          />
        </div>
        {/* Active Filters Display */}

        {(search || categoryId || jobType) && (
          <div className="my-4">
            <p className="text-sm text-gray-600">
              {search && (
                <span>
                  Searching for: <strong>&quot;{search}&quot;</strong>
                </span>
              )}
              {categoryId && categories && (
                <span className="">
                  Category:{" "}
                  <strong>
                    {categories.find((c) => c.id === categoryId)?.name}
                  </strong>
                </span>
              )}
              {jobType && (
                <span className="">
                  Type:{" "}
                  <strong className="capitalize">
                    {jobType.replace("-", " ")}
                  </strong>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {search || categoryId || jobType
              ? `${totalCount} Job${totalCount !== 1 ? "s" : ""} Found`
              : `All Available Jobs (${totalCount})`}
          </h2>
        </div>

        {/* Job Cards */}
        <div className="mb-8">
          <UserJobCards
            jobs={jobs}
            search={search}
            isLoggedIn={!!userId}
            userHasSkills={userHasSkills}
            userSkillsCount={userSkillsCount}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationComponent
              currentPage={currentPage}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              totalpages={totalPages}
            />
          </div>
        )}
      </div>
    </main>
  );
}
