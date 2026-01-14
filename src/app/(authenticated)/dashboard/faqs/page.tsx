import { PaginationComponent } from "../_components/pagination-component";
import { notFound } from "next/navigation";
import SearchInput from "../_components/search-input";
import AddFaqButton from "./_component/add-faq-button";
import { getAllFaqs } from "./action";
import FaqListing from "./_component/faq-listing";
import { getSignedInUser } from "@/lib/auth/server";
import EmptyState from "../_components/empty-state";

interface FaqsManagementPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CertificateManagementPage({
  searchParams,
}: FaqsManagementPageProps) {
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

  const sortField = "position";

  const sortOrder =
    resolvedSearchParams.sort === "asc" || resolvedSearchParams.sort === "desc"
      ? resolvedSearchParams.sort
      : "asc";

  const res = await getAllFaqs(page, limit, search, sortField, sortOrder);

  if (!res.success) {
    return notFound();
  }

  const {
    data: { faqs, totalPages, hasPreviousPage, hasNextPage, currentPage },
  } = res;

  const faqLists = Array.isArray(faqs) ? faqs : [];

  return (
    <main className="main-page">
      <h1 className="page-header">Faqs Management Page</h1>
      {/* button to open create DCR link */}
      <div className="filters-wrapper">
        <h2>
          {search ? `Showing results for "${search}"` : "List of all faq items"}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* add button */}
          <AddFaqButton />
          {/* search */}
          <SearchInput />
        </div>
      </div>
      {/* table component */}
      <div className="flex flex-col justify-between">
        {faqLists.length === 0 ? (
          <EmptyState AddButton={AddFaqButton} search={search} />
        ) : (
          <FaqListing faqs={faqLists} />
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
