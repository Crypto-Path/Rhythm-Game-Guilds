import * as React from "react";

// 1000 -> 1k || 1000000 -> 1m || etc.
function formatNumber(number, zeros = 0) {
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

function getRank(value) {
    const ranks = [
      'Soulless',
      'Copper',
      'Iron',
      'Jade',
      'Low gold',
      'High gold',
      'True gold',
      'Underlord',
      'Overlord',
      'Archlord',
      'Herald',
    ];
  
    // Ensure the value is within the range [0, 1000]
    const clampedValue = Math.min(999, Math.max(0, value));
  
    // Calculate the index based on the percentage of the value relative to the total range
    const index = Math.floor((clampedValue / 1000) * ranks.length);
  
    return [ranks[index], ((index+1)*1000/11)];
}

function getAccuracyRank(accuracy) {
    const ranks = [
      'Soulless',
      'Copper',
      'Iron',
      'Jade',
      'Low gold',
      'High gold',
      'True gold',
      'Underlord',
      'Overlord',
      'Archlord',
      'Sage',
    ];
  
    // Calculate the index based on an exponential scale
    let index = 0;
    const n = 2;
    const p = 0.85;
    const c = 2.5;
    const l = 99.8;
    const b = 63.1;
    let a = 0;

    for (let i = 1; i < ranks.length; i++) {
        // const element = ranks[i];
        const reqa = l - b;
        const reqb = Math.pow(n,i*Math.pow(p,c));
        const reqc = l-(reqa/reqb);
        
        a = reqc;
        if (accuracy >= reqc) {
            index++;
        } else {
            break;
        }
    }
  
    return [ranks[index], a];
  }

export const ProfileCard = ({data}) => {
    // param data is passed in as an object from the Quaver API
    // then, we transform into custom object with custom labels:
    const user = {
        // Info
        id: data.info.id,
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
    }
    // Add the custom user data:
    user.totalHits = user.hmarvs + user.hperfs + user.hgreats + user.hgoods + user.hokays + user.hmisses;
    user.rating = Math.pow(user.overallAccuracy / 98, 6) * user.overallPerformance;
    user.bonus = 1 + user.xRanks * 0.2 + user.ssRanks * 0.05 + user.sRanks * 0.01;
    user.consistency = Math.log2(user.playCount / (user.failCount + 1) * user.maxCombo);
    user.val = user.rating + user.bonus * user.consistency;
    user.profile = `https://quavergame.com/user/${user.id}`;
    user.guild = data.guild ? data.guild : "" ;
    user.stage = (getRank(user.overallPerformance)[0] === "Herald" && getAccuracyRank(user.overallAccuracy)[0] === "Sage") ? "Monarch" : getRank(user.overallPerformance * (user.overallAccuracy + 2) / 100)[0];

    return (
        <>
            <div className="user box-shadow">
                <div className="user-info-basic box-shadow">
                    <div className="user-info-id">
                        <img className="user-pfp box-shadow" src={user.pfp} alt="PFP" />
                        {/* <div id={`status-${user.id}`} className="user-status" style={{backgroundColor:"#f00"}} title="Online status is being fetched"></div> */}
                        <a className="user-name" href={user.profile} >
                            {user.username}
                        </a>
                        <span data-tooltip="custom stages based on Will Wight's novel, Cradle" data-flow="top">
                            {user.stage}
                        </span>
                    </div>
                    <div className="user-info-guild">
                        <div className="user-guild-tag">{user.guild}</div>
                    </div>
                </div>
                <div className="user-score">
                    <p data-tooltip="The overall performance of the user" data-flow="top">Performance : {formatNumber(user.overallPerformance, 4)}p ({getRank(user.overallPerformance)[0]}{formatNumber(Math.floor(user.overallPerformance), 0) === 727 ? " WYSI" : ""}) </p>
                    <p data-tooltip="The overall accuracy of the user" data-flow="top">Accuracy : {formatNumber(user.overallAccuracy, 4)}% ({getAccuracyRank(user.overallAccuracy)[0]}) </p>
                    <p data-tooltip="The total ranked score of the user" data-flow="top">Score : {formatNumber(user.rankedScore)} ({formatNumber(user.playCount)} plays)</p>
                </div>
                <div className="user-score">
                    <p data-tooltip="(Accuracy / 98)⁶ * Performance" data-flow="top">Rating : {formatNumber(user.rating, 1)}</p>
                    <p data-tooltip="X*0.2 + SS*0.05 + S*0.01" data-flow="top">Bonus : {formatNumber(user.bonus, 1)}</p>
                    <p data-tooltip="Log_2(Total Plays / Fails * Max Combo)" data-flow="top">Consistency : {formatNumber(user.consistency, 1)}</p>
                    <p data-tooltip="Rating + (Bonus * Consistency) | This is a custom ranking system to  rate who has the best stats" data-flow="top">Value : {formatNumber(user.val)}</p>
                </div>
                <div className="user-score">
                    <p>Notes hit: {formatNumber(user.totalHits)}</p>
                </div>
            </div>
        </>
    )
}