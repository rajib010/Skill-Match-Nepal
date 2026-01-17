"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";

interface SearchInputProps {
  defaultValue?: string;
}

function SearchInput({ defaultValue }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearchTerm = searchParams.get("search") || "";

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchedRef = useRef(urlSearchTerm);

  const [searchTerm, setSearchTerm] = useState(
    urlSearchTerm || defaultValue || ""
  );

  // Debounce search
  useEffect(() => {
    // Don't search if value hasn't changed from URL
    if (searchTerm === lastSearchedRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      lastSearchedRef.current = searchTerm;

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchTerm, urlSearchTerm, searchParams, router]);

  // Sync with URL when it changes externally
  useEffect(() => {
    if (
      urlSearchTerm !== searchTerm &&
      urlSearchTerm !== lastSearchedRef.current
    ) {
      setSearchTerm(urlSearchTerm);
      lastSearchedRef.current = urlSearchTerm;
    }
  }, [urlSearchTerm, searchTerm]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      <Input
        type="search"
        className="p-1.5 pl-10 bg-white rounded-md w-full"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default SearchInput;
