import { getSignedInUser } from "@/lib/auth/server";
import { getAppliedJobs } from "../actions";
import { notFound } from "next/navigation";
import AppliedJobCards from "./_components/applied-job-card";
import DropDownFilter from "@/app/(authenticated)/dashboard/_components/dropdown-filter";
import SearchInput from "@/app/(authenticated)/dashboard/_components/search-input";
import { PaginationComponent } from "@/app/(authenticated)/dashboard/_components/pagination-component";

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
    label: "Date Posted",
    key: "createdAt",
    options: {
      asc: "Oldest First",
      desc: "Newest First",
    },
  },
];

interface iAppProps {
  searchParams: Promise<{ [key: string]: string | string[] | unknown }>;
}

export default async function JobDetailPage({ searchParams }: iAppProps) {
  const session = await getSignedInUser();
  const userId = session?.id;

  if (!userId) {
    return notFound();
  }

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

  const sortField = ["title", "createdAt"].includes(
    resolvedParams.sortField as string
  )
    ? (resolvedParams.sortField as "title" | "createdAt")
    : "createdAt";

  const res = await getAppliedJobs(
    userId,
    page,
    limit,
    search,
    sortField,
    sortOrder
  );

  const jobs = res.success ? res.data.appliedJobs : [];
  const { totalPages, hasNextPage, hasPreviousPage } = res.data;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className=" flex flex-wrap justify-end gap-3">
          <SearchInput />

          {/* Sort */}
          <DropDownFilter
            sortField={sortField}
            fields={sortFields}
            search={search}
            sortOrder={sortOrder}
          />
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {search?.trim()
              ? `Showing results for "${search}"`
              : "Showing all of your applied jobs"}
          </h2>
        </div>

        {/* Job Cards */}
        <div className="mb-8">
          <AppliedJobCards jobs={jobs} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationComponent
              currentPage={page}
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
