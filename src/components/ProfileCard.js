import * as React from "react";

export const ProfileCard = ({data, profileUrl}) => {
    // param User is passed in as an object from the Quaver API
    // transform into custom object with custom labels:
    const user = {
        // Info
        id: 0,
        username: data.info.username,
        pfp: data.info.avatar_url,
        isActive: data.info.online,
        mainMode: "4K", //data.info.information.default_mode ? "4K" : "7K";
        country: data.info.country,

        // Keys 4
        cRank: data.keys4.countryRank,
        gRank: data.keys4.globalRank,
        mRank: data.keys4.multiplayerWinRank,
        // Grades
        xRanks: data.keys4.stats.count_grade_x,
        ssRanks: data.keys4.stats.count_grade_ss,
        sRanks: data.keys4.stats.count_grade_s,
        aRanks: data.keys4.stats.count_grade_a,
        bRanks: data.keys4.stats.count_grade_b,
        cRanks: data.keys4.stats.count_grade_c,
        dRanks: data.keys4.stats.count_grade_d,
        // Overall
        overallAccuracy: data.keys4.stats.overall_accuracy,
        overallPerformance: data.keys4.stats.overall_performance_rating,
        playCount: data.keys4.stats.play_count,
        failCount: data.keys4.stats.fail_count,
        maxCombo: data.keys4.stats.max_combo,
        rankedScore: data.keys4.stats.ranked_score,
        totalScore: data.keys4.stats.total_score,
        // AccuracyStuff
        hmarvs: data.keys4.stats.total_marv,
        hperfs: data.keys4.stats.total_perf,
        hgreats: data.keys4.stats.total_great,
        hgoods: data.keys4.stats.total_good,
        hokays: data.keys4.stats.total_okay,
        hmisses: data.keys4.stats.total_miss,
        // Other
        url: profileUrl,
    }
    // Add the custom user data:
    user.totalHits = user.hmarvs + user.hperfs + user.hgreats + user.hgoods + user.hokays + user.hmisses;
    user.rating = user.overallAccuracy / 100 * user.overallPerformance;
    user.bonus = 1 + user.xRanks * 1 + user.ssRanks * 0.05 + user.sRanks * 0.01;
    user.consistency = Math.log2(user.playCount / (user.failCount + 1) * user.maxCombo);
    user.val = user.rating + user.bonus * user.consistency;
    user.profile = `https://quavergame.com/user/${user.username}`;
    
    return (
        <>
            <div>{user.username}</div>
            <div>{user.pfp}</div>
        </>
    )
}