import { ErrorDisplay } from "@/app/(authenticated)/dashboard/_components/error-display";
import { getActiveJobs, getCategories } from "./actions";
import SearchInput from "@/app/(authenticated)/dashboard/_components/search-input";
import DropDownFilter from "@/app/(authenticated)/dashboard/_components/dropdown-filter";
import { UserJobCards } from "./_components/user-job-cards";
import { PaginationComponent } from "@/app/(authenticated)/dashboard/_components/pagination-component";


interface iAppProps {
  searchParams: Promise<{ [key: string]: string | string[] | unknown }>;
}

const sortFields = [
  {
    label: "Title",
    key: "title",
    options: {
      asc: "Title A-Z",
      desc: "Title Z-A",
    },
  },
  {
    label: "Company",
    key: "company",
    options: {
      asc: "Company A-Z",
      desc: "Company Z-A",
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

  const sortField = ["title", "company", "createdAt"].includes(
    resolvedParams.sortField as string
  )
    ? (resolvedParams.sortField as "title" | "company" | "createdAt")
    : "createdAt";

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
      location
    ),
    getCategories(),
  ]);

  if (!jobsRes.success) {
    return <ErrorDisplay message={jobsRes.message} />;
  }

  const {
    jobs,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
  } = jobsRes.data;

  const categories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <main className="min-h-screen bg-gray-50">
     
      

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <SearchInput  />
            </div>

            {/* Category Filter */}
            {/* // <CategoryFilter categories={categories || []} /> */}

            {/* Job Type Filter */}
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
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                {search && (
                  <span>
                    Searching for: <strong>&quot;{search}&quot;</strong>
                  </span>
                )}
                {categoryId && categories && (
                  <span className="ml-3">
                    Category:{" "}
                    <strong>
                      {categories.find((c) => c.id === categoryId)?.name}
                    </strong>
                  </span>
                )}
                {jobType && (
                  <span className="ml-3">
                    Type:{" "}
                    <strong className="capitalize">
                      {jobType.replace("-", " ")}
                    </strong>
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

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
          <UserJobCards jobs={jobs} search={search} />
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
