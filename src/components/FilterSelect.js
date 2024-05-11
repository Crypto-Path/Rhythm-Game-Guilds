import * as React from "react";
import { filterUsersCX } from "./context";

export const FilterSelect = ({options, type}) => {
    const filterUsers = React.useContext(filterUsersCX)
    
    /*
    const sortUsers = (parameter, order = 1) => {
        const users = Array.from(document.querySelectorAll('.user'));
    
        users.sort((a, b) => {
            const valueA = getValue(a, parameter);
            const valueB = getValue(b, parameter);
    
            if (valueA < valueB) {
                return -1 * order;
            }
            if (valueA > valueB) {
                return 1 * order;
            }
            return 0;
        });    
        const parent = users[0].parentNode;
        users.forEach(user => parent.appendChild(user));
    }
    */

    return (
        <>
            <div className="filter">
                <span className="filter-title">{type}:</span>
                <div className="filter-options-container">
                    {options.map(e => <span className="filter-option" onClick={filterUsers}>{e ? e : "All"}</span>)}
                </div>
            </div>
        </>
    )
}