import * as React from "react";
import { FilterSelect, SearchBar } from "./index"

export const SearchContainer = ({query, setQuery, setResults, guildKeys}) => {
    const sortOptions = [
        "Username",
        "Performance",
        "Accuracy",
        "Score",
        "Play Count",
        "Rating",
        "Bonus",
        "Consistency",
        "Value"
    ]
    return (
        <>
            <div className="search-container">
                <SearchBar query={query} setQuery={setQuery} setResults={setResults} />
                <div className="filter-container">
                    <FilterSelect options={guildKeys} type={"Guild"} />
                    <FilterSelect options={sortOptions} type={"Sort by"} />
                </div>
            </div>
        </>
    )
}