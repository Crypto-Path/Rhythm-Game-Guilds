import * as React from "react";

export const GuildCard = ({GuildBanner = "https://api.cyphemercury.online/images/ARG_Banner.jpg", GuildName = "Ascension:RG", description, userList}) => {
    return (
        /* TODO:  
         * Have the panel float to the right of the user list
         * Get guild data and load guild stats
         * Compare to other Guild option
         * Switch / Load other guilds ( << ARG >> )? OR make a sorting panel and Guilds be a grouping option
         */
        <>
        <div id="guildInfo">
            <div className="guild-panel box-shadow" id="guildInfoContent">
                <img className="guild-banner" src={GuildBanner} /> <br/>
                <a className="guild-name">{GuildName} ("ARG"{/*GuildKey*/})</a> <br/>
                <a className="guild-subtitle">Stats</a> <br/>
                <a className="guild-stat">Overall Performance: {} (avg. {}) (mean. {})</a> <br/>
                <a className="guild-stat">Overall Score: {} (avg. {}) (mean. {})</a> <br/>
                <a className="guild-stat">Overall Accuracy: {} (avg. {}) (mean. {})</a> <br/>
                <a className="guild-stat">Plays Count: {} (avg. {}) (mean. {})</a> <br/>
                <a className="guild-stat">Notes Hit: {} (avg. {}) (mean. {})</a> <br/>
                <a className="guild-stat">Members: {}</a>
            </div>
        </div>
        </>
    )
}