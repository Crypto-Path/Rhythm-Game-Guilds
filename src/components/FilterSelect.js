import * as React from "react";
import { filterUsersCX } from "./context";

export const FilterSelect = ({options, type, tooltips = []}) => {
    const filterUsers = React.useContext(filterUsersCX)
    
    React.useEffect(() => {
        // Reset the current selection to the first child on component initial render
        document.querySelectorAll(".filter-options-container").forEach(e => {
            let alrSelected = false;
            if (e.hasChildNodes()) {
                for (let i = 0; i < e.childNodes.length; i++) {
                    if (e.children[i].classList.contains("selected")) {
                        alrSelected = true;
                        break;
                    }
                }
                if (!alrSelected) e.firstElementChild.classList.add("selected")
            }
        })
    })

    return (
        <>
            <div className="filter">
                <span className="filter-title">{type}:</span>
                <div className="filter-options-container">
                    {options.map((e, i) => <span className="filter-option" data-tooltip={tooltips.length > 0 ? tooltips[i] : ""} onClick={filterUsers}>{e ? e : "All"}</span>)}
                </div>
            </div>
        </>
    )
}