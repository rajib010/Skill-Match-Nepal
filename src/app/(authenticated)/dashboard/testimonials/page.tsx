import { PaginationComponent } from "../_components/PaginationComponent";
import { notFound } from "next/navigation";
import SearchInput from "../_components/SearchInput";
import DropDownFilter from "../_components/DropdownFilter";
import { getAllTestimonials } from "./action";
import AddTestimonialButton from "./_components/AddTestimonialButton";
import TestimonialCollection from "./_components/Collection";
import { getSignedInUser } from "@/lib/auth/server";
import EmptyState from "../_components/EmptyState";

interface TestimonialManagementPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const sortFields = [
  { label: "Created At", key: "createdAt" },
  { label: "Name", key: "name" },
];

export default async function TestimonialManagePage({
  searchParams,
}: TestimonialManagementPageProps) {
  
  //check user role
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

  const sortField = ["name", "createdAt"].includes(
    resolvedSearchParams.sortField as string
  )
    ? (resolvedSearchParams.sortField as "name" | "createdAt")
    : "name";

  const sortOrder =
    resolvedSearchParams.sort === "asc" || resolvedSearchParams.sort === "desc"
      ? resolvedSearchParams.sort
      : "asc";

  const res = await getAllTestimonials(
    page,
    limit,
    search,
    sortField,
    sortOrder
  );

  if (!res.success) {
    return notFound();
  }
  const {
    data: {
      testimonials,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      currentPage,
    },
  } = res;

  const testimonialsList = Array.isArray(testimonials) ? testimonials : [];
  return (
    <main className="main-page">
      <h1 className="page-header">Manage Testimonials Page</h1>
      {/* button to open create DCR link */}
      <div className="filters-wrapper">
        <h2>
          {search
            ? `Showing results for "${search}"`
            : "List of all testimonials"}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* add button */}
          <AddTestimonialButton />
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
      {/* grid component */}
      <div className="flex flex-col justify-between">
        {testimonialsList.length === 0 ? (
          <EmptyState search={search} AddButton={AddTestimonialButton} />
        ) : (
          <TestimonialCollection testimonials={testimonials} search={search} />
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
