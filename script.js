const baseUrl = "https://api.quavergame.com/v1";
let users = []
let guild = document.getElementById('Guilds').value;
let guildScore = 0;
let guildPerformance = 0;

const Guilds = {
    "Guilded" : { // Testing
        "Members" : [ // Ignore this, this is just some small random list of people I am or was close to for sometime, oh and I'm in here :partying_face:
            "66471",    // Cyphe Mercury (ARG)
            "37932",    // Mystifical07 (ARG)
            "207094",   // Hiso
            "345922",   // Kantalla (ESV)
            "529469",   // Kantalla's Wife
            "200927",   // Kidnapper
            "564030",   // Four!!
            "537305",   // Mach
            "292803",   // Nanahira Lover (ESV)
            "636610",   // ttvxmkey1
            "339576",   // Average (ESV)
            "275805",   // Wackyy
            "132338",   // JJonasB
            "28041",    // Wandering Kitten
            "608",      // Reshi
        ]
    },
    "ARG" : {
        "Name": "Ascension : Rhythm Games",
        "Desc": "A guild for everything rhythm game, but focuses primarily on the 4K/7K-VSRG, Quaver, 4K mode. The owner is the idiot who made this, Quaver Guide (doesn't really work), and discord bot Alpha Mercury (only in ARG discord server as of now)",
        "Members" : [
            "66471",
            "37932",
            "207094",
            "275805"
        ]
    },
    "ESV" : {
        "Name": "Everything Scroll Velocity",
        "Desc":"",
        "Members" : [
            "53425",
            "345922",
            "292803",
            "339576",
            "659573",
            "653123",
            "599944",
            "369530",
            "1223",
            "332660",
            "242639",
            "206601"

        ]
    },
    "ATP" : {
        "Name": "Auto Taco Pet (idk)",
        "Desc":"",
        "Members" : [
            "312737",
            "97620",
            "297782",
            "57490",
            "303592",
            "278026",
            "401686",
            "336206",
            "29951",
            "31771",
            "82620",
            "44614",
            "239463",
            "293151"
        ]
    },
    "FQH" : {
        "Name": "Funny Quarter House (idk)",
        "Desc":"",
        "Members" : [
            "45749"
        ]
    },
    "ERA" : {
        "Name": "Eat Red Alligators (idk)",
        "Desc":"",
        "Members" : [
            "74949",
            "3455",
            "139104",
            "633020",
            "158280",
            "77881",
            "138099",
            "202923",
            "634686",
            "105894",
            "243570",
            "156178",
            "658653",
            "8907",
        ]
    },
    "ABSR" : {
        "Name": "A Bunny Shoots Reindeer (idk)",
        "Desc":"",
        "Members" : [
            "180435",
            "3233",
            "109823",
        ]
    },
    "TC" : {
        "Name": "TacoCat (idk)",
        "Desc":"",
        "Members" : [
            "103197",
            "95481",
            "94271",
            "35229",
            "477317",
            "98466",
            "256802",
        ]
    }
}

// Creates the users and calculates the guild scores
function getScores(list = undefined /* Custom user list for "usernames" search bar */) {
  const guilded = [].concat(Guilds.ARG.Members, Guilds.ESV.Members, Guilds.ATP.Members, Guilds.FQH.Members, Guilds.ERA.Members, Guilds.ABSR.Members, Guilds.TC.Members) // Default || Every known member of every known guild (excluding Guilded Guild, which was just for testing)
  const usernames = ((list) ? list : (document.getElementById('Guilds').value) ? Guilds[document.getElementById('Guilds').value].Members : guilded);//document.getElementById("usernames").value.split(",");
  const resultsDiv = document.getElementById("results");
  const guildInfo = document.getElementById("guildInfoContent");
  guildInfo.innerHTML = "";
  resultsDiv.innerHTML = "";

  guild = (document.getElementById('Guilds').value != "") ? document.getElementById('Guilds').value : "All / Custom" ; // Name for guild info
  users = []; // Users in guild / are loaded
  guildScore = 0; // Total score
  guildPerformance = 0; // Custom performance system

  let performances = [];

  usernames.forEach(async (username) => {
    let index = 0;
    const trimmedUsername = username.trim();
    const url = `${baseUrl}/users/full/${trimmedUsername}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const user = new User(data.user, url);
      users.push(user)
      user.createUserUI();
      guildScore += user.totalScore;

      performances.push(user.overallPerformance)
      performances = performances.sort(function(a, b) {
        return b - a;
      });
  
      let tempPerformance = 0;
      performances.forEach((rating) => {
        const weighted = rating * Math.pow(0.97, index);
        tempPerformance += weighted;
    
        index++;
      })
      guildPerformance = tempPerformance;

      let playCount = 0;
      users.forEach((user) => {
        playCount += user.playCount;
      })
      guildInfo.innerHTML = 
      `<h1>Guild (${guild})</h1>
      <br><h2>Stats</h2>Overall Performance: ${formatNumber(guildPerformance)}
      <br>Overall Score: ${formatNumber(guildScore)}
      <br>Members: ${formatNumber(users.length)}
      <br>Play Count: ${formatNumber(playCount)} (AVG: ${formatNumber(playCount/users.length)})`;
    } catch (error) {
      console.error("Error fetching data for", username, error);
      resultsDiv.innerHTML += `<p class="user-score">${trimmedUsername}: Error fetching data.</p>`;
    }
  });

  const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.classList.contains("gone")) {
            option.classList.remove("gone");
        }
    }    
}

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

// TODO: Simplify into 1 function for the stages
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
  
    return [ranks[index], ((index+1)*1000/13)];
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
        const element = ranks[i];
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

// User data
class User {
    constructor(data, url, guild) {
        // Info
        this.username = data.info.username;
        this.pfp = data.info.avatar_url
        this.isActive = data.info.online;
        this.mainMode = "4K"; //data.info.information.default_mode ? "4K" : "7K";
        this.country = data.info.country;

        // Keys 4
        this.cRank = data.keys4.countryRank;
        this.gRank = data.keys4.globalRank;
        this.mRank = data.keys4.multiplayerWinRank;
        // Grades
        this.xRanks = data.keys4.stats.count_grade_x;
        this.ssRanks = data.keys4.stats.count_grade_ss;
        this.sRanks = data.keys4.stats.count_grade_s;
        this.aRanks = data.keys4.stats.count_grade_a;
        this.bRanks = data.keys4.stats.count_grade_b;
        this.cRanks = data.keys4.stats.count_grade_c;
        this.dRanks = data.keys4.stats.count_grade_d;
        // Overall
        this.overallAccuracy = data.keys4.stats.overall_accuracy;
        this.overallPerformance = data.keys4.stats.overall_performance_rating;
        this.playCount = data.keys4.stats.play_count;
        this.failCount = data.keys4.stats.fail_count
        this.maxCombo = data.keys4.stats.max_combo;
        this.rankedScore = data.keys4.stats.ranked_score;
        this.totalScore = data.keys4.stats.total_score;
        // Stats
        this.rating = this.overallAccuracy / 100 * this.overallPerformance;
        this.bonus = 1 + this.xRanks * 1 + this.ssRanks * 0.05 + this.sRanks * 0.01;
        this.consistency = Math.log2(this.playCount / (this.failCount + 1) * this.maxCombo);
        this.val = this.rating + this.bonus * this.consistency;

        // Keys 7

        // Other
        this.url = url;
        this.profile = `https://quavergame.com/user/${this.username}`;
    }

    // Creates the user thingyy...
    createUserUI() {
        const results = document.getElementById("results");
        results.innerHTML += 
        `<div class="user box-shadow">
            <div class="user-info-basic box-shadow">
                <img class="user-pfp box-shadow" src="${this.pfp}">
                <div class="user-status" style="background-color: ${this.isActive ? "green" : "red"};" title="This is supposed to show the users online status, but I'm not sure if the api works correctly"></div>
                <a class="user-name " href="${this.profile}">
                    ${this.username}
                </a>
                <a>
                    (${(getRank(this.overallPerformance)[0] == "Herald" && getAccuracyRank(this.overallAccuracy)[0] == "Sage") ? "Monarch" : getRank(this.overallPerformance * (this.overallAccuracy + 2) / 100)[0]})
                </a>
            </div>
            <div class="user-score">
                <p> Performance : ${formatNumber(this.overallPerformance, 4)}p (${getRank(this.overallPerformance)[0]}) </p>
                <p> Accuracy : ${formatNumber(this.overallAccuracy, 4)}% (${getAccuracyRank(this.overallAccuracy)[0]}) </p>
                <p> Score : ${formatNumber(this.rankedScore)} </p>
            </div>
            <div class="user-score">
                <p> Rating : ${formatNumber(this.rating)} </p>
                <p> Bonus : ${formatNumber(this.bonus)} </p>
                <p> consistency : ${formatNumber(this.consistency)} </p>
                <p> Value : ${formatNumber(this.val)} </p>
            </div>
        </div>`;
    }
}