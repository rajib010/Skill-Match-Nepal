"use client";

import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getTopSearches, trackSearchQuery } from "../actions";

interface JobSearchInputProps {
  userId?: string;
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
}

export function JobSearchInput({
  placeholder = "Search for jobs, companies, or keywords...",
  autoFocus = false,
  initialValue = "",
}: JobSearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load top searches on mount
  useEffect(() => {
    async function loadSuggestions() {
      try {
        setIsLoadingSuggestions(true);
        const topSearches = await getTopSearches(10, 30);
        setSuggestions(topSearches.map((s) => s.query));
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }
    loadSuggestions();
  }, []);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = query
    ? suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase()),
      )
    : suggestions;

  const handleSearch = async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setIsSearching(true);
    try {
      await trackSearchQuery(trimmedQuery);
      // Navigate to search results page
      router.push(`/jobs?search=${encodeURIComponent(trimmedQuery)}`);

      setShowSuggestions(false);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleClearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(query);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const shouldShowSuggestions =
    showSuggestions && filteredSuggestions.length > 0 && !isLoadingSuggestions;

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 text-white"
            autoFocus={autoFocus}
            disabled={isSearching}
            aria-label="Job search"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={shouldShowSuggestions}
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          onClick={() => handleSearch(query)}
          disabled={!query.trim() || isSearching}
          className="min-w-[100px]"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {shouldShowSuggestions && (
        <Card
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute top-full mt-2 w-full z-50 shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
        >
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {query ? "Matching Searches" : "Popular Searches"}
            </div>
            <div className="space-y-1">
              {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors capitalize text-sm"
                  role="option"
                  aria-selected="false"
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span className="flex-1">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>

            {query && filteredSuggestions.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                No matching searches found
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Loading state for suggestions */}
      {showSuggestions && isLoadingSuggestions && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading suggestions...
          </div>
        </Card>
      )}
    </div>
  );
}
