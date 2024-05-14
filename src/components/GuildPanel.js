import * as React from "react";

export const GuildPanel = ({guildInfo, userList}) => {
    const [guildStats, setGuildStats] = React.useState({});

    userList.sort((user1, user2) => {
        if (user1.keys4.stats.overall_performance_rating > user2.keys4.stats.overall_performance_rating) {
            return -1;
        }
        if (user1.keys4.stats.overall_performance_rating < user2.keys4.stats.overall_performance_rating) {
            return 1;
        }
        return 0;
    });

    const getGuildStats = () => {
        let tempGuildStats = {
            overallPerformance: 0,
            averagePerformance: 0,

            score: 0,
            averageScore: 0,

            averageAccuracy: 0,

            totalPlayCount: 0,
            averagePlayCount: 0,

            totalHits: 0,
            averageHits: 0,
        }
        
        userList.forEach(user => {
            tempGuildStats.overallPerformance += user.keys4.stats.overall_performance_rating * ( Math.pow(0.95, userList.indexOf(user)) );
            tempGuildStats.averagePerformance += user.keys4.stats.overall_performance_rating / userList.length;

            tempGuildStats.score += user.keys4.stats.ranked_score;
            tempGuildStats.averageScore += user.keys4.stats.ranked_score / userList.length;;

            tempGuildStats.averageAccuracy += user.keys4.stats.overall_accuracy / userList.length;

            tempGuildStats.totalPlayCount += user.keys4.stats.play_count;
            tempGuildStats.averagePlayCount += user.keys4.stats.play_count / userList.length;

            tempGuildStats.totalHits += user.keys4.stats.total_marv + user.keys4.stats.total_perf + user.keys4.stats.total_great + user.keys4.stats.total_good + user.keys4.stats.total_okay;
            tempGuildStats.averageHits += ( user.keys4.stats.total_marv + user.keys4.stats.total_perf + user.keys4.stats.total_great + user.keys4.stats.total_good + user.keys4.stats.total_okay ) / userList.length;
        });

        if (tempGuildStats != guildStats) {
            setGuildStats(tempGuildStats);
        }
    }

    React.useEffect(() => {
            getGuildStats();
    }, [guildStats]);

    const formatNumber = (number, zeros = 0) => {
        if (number === 0) return "0";
      
        const suffixes = ["K", "M", "B", "T"];
        const magnitudes = [1000, 1000000, 1000000000, 1000000000000];
      
        const absNumber = Math.abs(number);
        for (let i = magnitudes.length - 1; i >= 0; i--) {
            if (absNumber >= magnitudes[i]) {
                const rounded = Math.round(absNumber / magnitudes[i] * 10) / 10;
                return `${rounded}${suffixes[i]}`;
            }
        }
      
        // If the number is less than 1000, return the original number
        return Math.round(absNumber * Math.pow(10, zeros)) / Math.pow(10, zeros);
    }

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
                <img className="guild-banner" alt="" src={guildInfo.banner} /> <br/>
                <span className="guild-name link-like">{guildInfo.name}</span> <br/>
                <span className="guild-desc link-like">{guildInfo.description}</span> <br/>
                <span className="guild-subtitle link-like">Stats</span> <br/>
                <div className="guild-container-stats">
                    <span className="guild-stat link-like">Overall Performance: {formatNumber(Math.floor(guildStats.overallPerformance))} (avg. {formatNumber(Math.floor(guildStats.averagePerformance))})</span> <br/>
                    <span className="guild-stat">Overall Score: {formatNumber(Math.floor(guildStats.score))} (avg. {formatNumber(Math.floor(guildStats.averageScore))})</span> <br/>
                    <span className="guild-stat link-like">Overall Accuracy: {Math.floor(guildStats.averageAccuracy*10000)/10000}%</span> <br/>
                    <span className="guild-stat link-like">Plays Count: {formatNumber(Math.floor(guildStats.totalPlayCount))} (avg. {formatNumber(Math.floor(guildStats.averagePlayCount))})</span> <br/>
                    <span className="guild-stat link-like">Notes Hit: {formatNumber(Math.floor(guildStats.totalHits))} (avg. {formatNumber(Math.floor(guildStats.averageHits))})</span> <br/>
                    <span className="guild-stat link-like">Members: {userList.length}</span> <br/>
                </div>
            </div>
        </div>
        </>
    )
}