"use client";

import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getTopSearches } from "../actions";

interface JobSearchInputProps {
  userId?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function JobSearchInput({
  onSearch,
  placeholder = "Search for jobs, companies, or keywords...",
  autoFocus = false,
}: JobSearchInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSuggestions() {
      const topSearches = await getTopSearches(10, 30);
      setSuggestions(topSearches.map((s) => s.query));
    }
    loadSuggestions();
  }, []);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Navigate to search results page
        router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
      }
      setShowSuggestions(false);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow suggestion click
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(query);
              }
            }}
            className="pl-10 text-white focus:border-none"
            autoFocus={autoFocus}
            disabled={isSearching}
          />
        </div>
        <Button
          onClick={() => handleSearch(query)}
          disabled={!query.trim() || isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {showSuggestions && query && filteredSuggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Popular Searches
            </div>
            <div className="space-y-1">
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors capitalize"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {showSuggestions && !query && suggestions.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Popular Searches
            </div>
            <div className="space-y-1">
              {suggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors capitalize"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
