"use client";

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

  const urlSearchTerm = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(
    urlSearchTerm || defaultValue || "",
  );

  // Keep a ref to latest searchParams to avoid stale closure in debounce
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // Track whether the last URL update was triggered by us
  const isSelfUpdateRef = useRef(false);

  // Debounce: push to URL when user types
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParamsRef.current.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1");

      isSelfUpdateRef.current = true;

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router]);

  // Sync input when URL changes externally
  useEffect(() => {
    if (isSelfUpdateRef.current) {
      // This URL change was triggered by us — don't reset the input
      isSelfUpdateRef.current = false;
      return;
    }
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      <input
        type="search"
        className="border p-1.5 pl-10 rounded-md w-full"
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
