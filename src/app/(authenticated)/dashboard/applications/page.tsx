import React from "react";
import { PaginationComponent } from "../_components/pagination-component";
import DropDownFilter from "../_components/dropdown-filter";
import SearchInput from "../_components/search-input";
import { getAllApplications } from "./actions";
import { notFound } from "next/navigation";
import { ApplicationTable } from "./_components/applications-table";

interface ApplicationManagementPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const sortFields = [
  {
    label: "Date Posted",
    key: "createdAt",
    options: {
      asc: "Oldest First",
      desc: "Newest First",
    },
  },
];
export default async function Page({
  searchParams,
}: ApplicationManagementPageProps) {
  const resolvedSearchParams = await searchParams;
  const limit = resolvedSearchParams.limit
    ? Number(resolvedSearchParams.limit)
    : 10;
  const page = resolvedSearchParams.page
    ? Number(resolvedSearchParams.page)
    : 1;
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : undefined;

  const sortOrder =
    resolvedSearchParams.sort === "asc" || resolvedSearchParams.sort === "desc"
      ? resolvedSearchParams.sort
      : "desc";

  const sortField = "createdAt";

  const res = await getAllApplications(
    page,
    limit,
    search,
    sortField,
    sortOrder
  );

  if (!res.success) {
    return notFound();
  }

  const { applications, totalPages, hasNextPage, hasPreviousPage } = res.data;

  return (
    <main className="main-page">
      <h1 className="page-header">Applications Management Page</h1>
      {/* button to open create DCR link */}
      <div className="filters-wrapper">
        <h2>
          {search
            ? `Showing results for "${search}"`
            : "List of all applications"}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* search */}
          <SearchInput />

          <DropDownFilter
            fields={sortFields}
            search={search}
            sortField={sortField}
            sortOrder={sortOrder}
          />
        </div>
      </div>
      {/* table component */}
      <div className="flex flex-col justify-between">
        {applications.length === 0 ? (
          //   TODO empty state
          <></>
        ) : (
          <ApplicationTable
            applications={applications}
            limit={limit}
            page={page}
            search={search}
          />
        )}
        {/* pagination component */}
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={page}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            totalpages={totalPages}
          />
        )}
      </div>
    </main>
  );
}
