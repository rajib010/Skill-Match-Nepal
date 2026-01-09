import DropDownFilter from "../_components/DropdownFilter";
import { ErrorDisplay } from "../_components/ErrorDisplay";
import { PaginationComponent } from "../_components/PaginationComponent";
import SearchInput from "../_components/SearchInput";
import { getAllJobs } from "./action";
import { JobCards } from "./_components/JobCards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

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
    label: "Date",
    key: "createdAt",
    options: {
      asc: "Oldest First",
      desc: "Newest First",
    },
  },
];

export default async function Page({ searchParams }: iAppProps) {
  const resolvedParams = await searchParams;

  const limit = resolvedParams.limit ? Number(resolvedParams.limit) : 10;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
  const search =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;

  const sortOrder =
    resolvedParams.sort === "asc" || resolvedParams.sort === "desc"
      ? resolvedParams.sort
      : "asc";

  const sortField = ["title", "createdAt"].includes(
    resolvedParams.sortField as string
  )
    ? (resolvedParams.sortField as "title" | "createdAt")
    : "createdAt";

  const res = await getAllJobs(page, limit, search, sortField, sortOrder);

  if (!res.success) {
    <ErrorDisplay message={res.message} />;
  }

  const { jobs, currentPage, totalPages, hasNextPage, hasPreviousPage } =
    res.data;

  return (
    <main className="main-page">
      <h1 className="font-semibold text-2xl">Jobs Page</h1>
      {/* button to open create DCR link */}
      <div className="flex justify-between items-center">
        <h2>
          {search ? `Showing results for "${search}"` : "List of all jobs"}
        </h2>
        <div className="flex items-center justify-between gap-2">
          {/* add button */}
          <Button asChild>
            <Link href="/dashboard/customers/add">
              <BriefcaseBusiness /> Add Job
            </Link>
          </Button>
          {/* search */}
          <SearchInput />
          {/* filters */}
          <DropDownFilter
            sortField={sortField}
            fields={sortFields}
            search={search}
            sortOrder={sortOrder}
          />
        </div>
      </div>
      {/* table component */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="overflow-auto">
          <JobCards jobs={jobs} search={search} />
        </div>
        {/* pagination component */}
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={currentPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            totalpages={totalPages}
          />
        )}
      </div>
    </main>
  );
}
