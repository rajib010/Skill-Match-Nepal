"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect, useCallback, useRef } from "react";

interface SearchInputProps {
  defaultValue?: string;
}

function SearchInput({ defaultValue }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || defaultValue || ""
  );
  const isUserTyping = useRef(false);

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim() !== "") {
        params.set("search", value.trim());
        params.set("page", "1");
      } else {
        params.delete("search");
        params.set("page", "1");
      }

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [searchParams, router]
  );

  // Debounce effect
  useEffect(() => {
    if (!isUserTyping.current) return;

    const timer = setTimeout(() => {
      handleSearch(searchTerm);
      isUserTyping.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchTerm);
      isUserTyping.current = false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true;
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      <input
        type="search"
        className="border p-1.5 pl-10 rounded-md w-full"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
