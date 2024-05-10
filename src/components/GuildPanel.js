import * as React from "react";

export const GuildPanel = ({GuildBanner = "https://api.cyphemercury.online/images/ARG_Banner.jpg", GuildName = "Ascension:RG", description = "Epic Description", userList}) => {
    return (
        /* TODO:  
         * Have the panel float to the right of the user list
         * Get guild data and load guild stats
         * Compare to other Guild option
         * Switch / Load other guilds ( << ARG >> )? OR make a sorting panel and Guilds be a grouping option
         */
        <>
        <div id="guildInfo">
            <div className="guild guild-panel box-shadow" id="guildInfoContent">
                <img className="guild-banner" alt="" src={GuildBanner} /> <br/>
                <span className="guild-name link-like">{GuildName} (ARG{/*GuildKey*/})</span> <br/>
                <span className="guild-desc link-like">{description}</span> <br/>
                <span className="guild-subtitle link-like">Stats</span> <br/>
                <div className="guild-container-stats">
                    <span className="guild-stat link-like">Overall Performance: {} (avg. {}) (mean. {})</span> <br/>
                    <span className="guild-stat">Overall Score: {} (avg. {}) (mean. {})</span> <br/>
                    <span className="guild-stat link-like">Overall Accuracy: {} (avg. {}) (mean. {})</span> <br/>
                    <span className="guild-stat link-like">Plays Count: {} (avg. {}) (mean. {})</span> <br/>
                    <span className="guild-stat link-like">Notes Hit: {} (avg. {}) (mean. {})</span> <br/>
                    <span className="guild-stat link-like">Members: {}</span> <br/>
                </div>
            </div>
        </div>
        </>
    )
}