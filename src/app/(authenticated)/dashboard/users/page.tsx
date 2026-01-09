import DropDownFilter from "../_components/DropdownFilter";
import { ErrorDisplay } from "../_components/ErrorDisplay";
import { PaginationComponent } from "../_components/PaginationComponent";
import SearchInput from "../_components/SearchInput";
import { getAllUsers } from "./action";
import { UserTable } from "./_components/UsersTable";

interface iAppProps {
  searchParams: Promise<{ [key: string]: string | string[] | unknown }>;
}

const sortFields = [
  {
    label: "Name",
    key: "name",
    options: {
      asc: "Name Asc",
      desc: "Name Desc",
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

  const sortField = ["name", "createdAt"].includes(
    resolvedParams.sortField as string
  )
    ? (resolvedParams.sortField as "name" | "createdAt")
    : "name";

  const res = await getAllUsers(page, limit, search, sortField, sortOrder);

  if (!res.success) {
    <ErrorDisplay message={res.message} />;
  }

  const {
    users,

    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  } = res.data;

  return (
    <main className="main-page">
      <h1 className="page-header">Users Page</h1>
      {/* button to open create DCR link */}
      <div className="filters-wrapper">
        <h2>
          {search ? `Showing results for "${search}"` : "List of all users"}
        </h2>
        <div className="flex items-center justify-between gap-2">
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
          <UserTable
            users={users}
            limit={limit}
            page={page}
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
