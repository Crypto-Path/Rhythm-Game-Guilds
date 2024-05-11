import * as React from "react";
import { filterUsersCX } from "./context";

export const FilterSelect = ({options, type}) => {
    const filterUsers = React.useContext(filterUsersCX)
    
    React.useEffect(() => {
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
                    {options.map(e => <span className="filter-option" onClick={filterUsers}>{e ? e : "All"}</span>)}
                </div>
            </div>
        </>
    )
}