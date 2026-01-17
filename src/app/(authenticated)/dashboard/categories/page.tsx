import { PaginationComponent } from "../_components/pagination-component";
import { notFound } from "next/navigation";
import SearchInput from "../_components/search-input";
import { getSignedInUser } from "@/lib/auth/server";
import EmptyState from "../_components/empty-state";
import { getAllCategory } from "./actions";
import AddCategoryButton from "./_components/add-categories";
import DropDownFilter from "../_components/dropdown-filter";
import { CategoryTable } from "./_components/category-table";

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
  {
    label: "Date",
    key: "jobs._count",
    options: {
      desc: "Most Jobs",
      asc: "Least Jobs",
    },
  },
];

interface CategoryManagementPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CertificateManagementPage({
  searchParams,
}: CategoryManagementPageProps) {
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

  const sortOrder =
    resolvedSearchParams.sort === "asc" || resolvedSearchParams.sort === "desc"
      ? resolvedSearchParams.sort
      : "asc";

  const sortField = ["name", "createdAt", "jobs._count"].includes(
    resolvedSearchParams.sortField as string
  )
    ? (resolvedSearchParams.sortField as "name" | "createdAt" | "jobs._count")
    : "createdAt";

  const res = await getAllCategory(page, limit, search, sortField, sortOrder);

  if (!res.success) {
    return notFound();
  }

  const {
    data: { categories, totalPages, hasPreviousPage, hasNextPage, currentPage },
  } = res;

  const categoriesLists = Array.isArray(categories) ? categories : [];

  return (
    <main className="main-page">
      <h1 className="page-header">Categories Management Page</h1>
      {/* button to open create DCR link */}
      <div className="filters-wrapper">
        <h2>
          {search
            ? `Showing results for "${search}"`
            : "List of all category items"}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* add button */}
          <AddCategoryButton />
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
        {categoriesLists.length === 0 ? (
          <EmptyState AddButton={AddCategoryButton} search={search} />
        ) : (
          <CategoryTable
            categories={categories}
            limit={limit}
            page={page}
            search={search}
          />
        )}
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
