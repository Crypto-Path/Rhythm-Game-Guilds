import * as React from "react";
import { FilterSelect } from "./FilterSelect";
import { SearchBar } from "./SearchBar";

export const SearchContainer = ({query, setQuery, setResults, guildKeys}) => {
    return (
        <>
            <div className="search-container">
                <SearchBar query={query} setQuery={setQuery} setResults={setResults} />
                <div className="filter-container">
                    <FilterSelect options={guildKeys} />
                </div>
            </div>
        </>
    )
}