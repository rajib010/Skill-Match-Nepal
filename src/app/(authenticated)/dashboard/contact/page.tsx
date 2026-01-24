import { notFound } from "next/navigation";
import { getAllContacts } from "./actions";
import ContactTable from "./_components/ContactTable";
import { getSignedInUser } from "@/lib/auth/server";
import SearchInput from "../_components/search-input";
import DropDownFilter from "../_components/dropdown-filter";
import { PaginationComponent } from "../_components/pagination-component";

interface ContactManagementPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const sortFields = [
  { label: "Created At", key: "createdAt" },
  { label: "Name", key: "name" },
];

export default async function NewsManagementPage({
  searchParams,
}: ContactManagementPageProps) {
  //check user
  const user = await getSignedInUser();

  if (!user || user.role !== "admin") {
    return notFound();
  }
  //filters
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

  const sortField = ["createdAt", "name"].includes(
    resolvedSearchParams.sortField as string
  )
    ? (resolvedSearchParams.sortField as "createdAt" | "name")
    : "createdAt";

  const sortOrder =
    resolvedSearchParams.sort === "asc" || resolvedSearchParams.sort === "desc"
      ? resolvedSearchParams.sort
      : "asc";

  const res = await getAllContacts(page, limit, search, sortField, sortOrder);

  if (!res.success) {
    return notFound();
  }

  const {
    data: { contacts, totalPages, hasPreviousPage, hasNextPage, currentPage },
  } = res;

  return (
    <main className="main-page">
      <h1 className="page-header">Contact Page</h1>
      {/* button to open create DCR link */}
      <div className="filters-wrapper">
        <h2>
          {search
            ? `Showing results for "${search}"`
            : "List of all contact submissions"}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* search */}
          <SearchInput />
          <DropDownFilter
            search={search}
            sortOrder={sortOrder}
            fields={sortFields}
            sortField={sortField}
          />
        </div>
      </div>
      {/* table component */}
      <div className="w-full flex flex-col justify-between">
        <div className="overflow-auto min-w-[170px]">
          <ContactTable
            limit={limit}
            page={page}
            contacts={contacts}
            search={search}
          />
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
