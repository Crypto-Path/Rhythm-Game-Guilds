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
    ];

    const sortOrder = [
        "Ascending",
        "Descending"
    ];

    const onlineStatus = [
        "Online",
        "Playing",
        "Mapping",
        "Idle",
        "Offline"
    ]

    return (
        <>
            <div className="search-container">
                <SearchBar query={query} setQuery={setQuery} setResults={setResults} />
                <div className="filter-container">
                    <FilterSelect options={guildKeys} type={"Guild"} />
                    <FilterSelect options={sortOptions} type={"Sort by"} />
                    <FilterSelect options={sortOrder} type={"Order"} />
                    {/* Not implemented yet! Just visuals */}
                    <FilterSelect options={onlineStatus} type={"Status"} />
                </div>
            </div>
        </>
    )
}