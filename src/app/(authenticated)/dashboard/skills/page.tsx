// app/dashboard/skills/page.tsx
import DropDownFilter from "../_components/dropdown-filter";
import { ErrorDisplay } from "../_components/error-display";
import { PaginationComponent } from "../_components/pagination-component";
import SearchInput from "../_components/search-input";
import { SkillCards } from "./_components/skill-card";
import { getAllSkills } from "./action";

interface iAppProps {
  searchParams: Promise<{ [key: string]: string | string[] | unknown }>;
}

const sortFields = [
  {
    label: "Skill Name",
    key: "skillName",
    options: {
      asc: "A-Z",
      desc: "Z-A",
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

export default async function SkillsPage({ searchParams }: iAppProps) {
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

  const sortField = ["skillName", "createdAt"].includes(
    resolvedParams.sortField as string
  )
    ? (resolvedParams.sortField as "skillName" | "level" | "createdAt")
    : "createdAt";

  // Fetch skills and profiles in parallel
  const [skillsRes] = await Promise.all([
    getAllSkills(page, limit, search, sortField, sortOrder),
  ]);

  if (!skillsRes.success) {
    return <ErrorDisplay message={skillsRes.message} />;
  }

  const { skills, currentPage, totalPages, hasNextPage, hasPreviousPage } =
    skillsRes.data;

  return (
    <main className="main-page">
      <h1 className="page-header">Skills Management</h1>

      {/* Filters and Actions */}
      <div className="filters-wrapper">
        <h2 className="text-lg font-semibold">
          {search
            ? `Showing results for "${search}"`
            : `All Skills (${skills.length})`}
        </h2>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Add Skills Button */}
          {/* <SkillAddButton /> */}

          {/* Search */}
          <SearchInput />

          {/* Filters */}
          <DropDownFilter
            sortField={sortField}
            fields={sortFields}
            search={search}
            sortOrder={sortOrder}
          />
        </div>
      </div>

      {/* Skills Cards */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="overflow-auto">
          <SkillCards skills={skills} search={search} />
        </div>

        {/* Pagination */}
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
