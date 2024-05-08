import * as React from "react";

export const FilterSelect = ({options}) => {
    return (
        <>
            <div className="filter">
                <select>
                    {options.map(e => {
                        return <option value={e}>{e ? e : "Custom"}</option>
                    })}
                </select>
            </div>
        </>
    )
}