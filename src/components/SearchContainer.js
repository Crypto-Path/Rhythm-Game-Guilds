import * as React from "react";
import { FilterSelect, SearchBar } from "./index"

export const SearchContainer = ({query, setQuery, setResults, guildKeys}) => {
    const sortOptions = {
        "Username": "",
        "Performance": "",
        "Accuracy": "",
        "Score": "",
        "Play Count": "",
        "Rating": "(Accuracy / 98)⁶ * Performance",
        "Bonus": "X*0.2 + SS*0.05 + S*0.01",
        "Consistency": "Log_2(Total Plays / Fails * Max Combo)",
        "Value": "Rating + (Bonus * Consistency)",
    }

    const sortOrder = [
        "Ascending",
        "Descending"
    ];

    // const onlineStatus = [
    //     "Online",
    //     "Playing",
    //     "Mapping",
    //     "Idle",
    //     "Offline"
    // ]

    return (
        <>
            <div className="search-container">
                <SearchBar query={query} setQuery={setQuery} setResults={setResults} />
                <div className="filter-container">
                    <FilterSelect options={guildKeys} type={"Guild"} />
                    <FilterSelect options={Object.keys(sortOptions)} type={"Sort by"} tooltips={Object.values(sortOptions)} />
                    <FilterSelect options={sortOrder} type={"Order"} />
                    {/* Not implemented yet! Just visuals */}
                    {/* <FilterSelect options={onlineStatus} type={"Status"} /> */}
                </div>
            </div>
        </>
    )
}