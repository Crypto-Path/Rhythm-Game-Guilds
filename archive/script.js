const baseUrl = "https://api.quavergame.com/v1";
let users = []
let guild = document.getElementById('Guilds').value;
let guildScore = 0;
let guildPerformance = 0;

let Guilds = {}
async function fetchGuildData() {
    try {
        console.log("Fetching guild data");
        const response = await fetch("https://api.cyphemercury.online/data.json");
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching guild data:", error);
        return null;
    }
}

async function initializeGuildData() {
    const guildData = await fetchGuildData();
    if (guildData) {
        Guilds = guildData;
        getScores();
    }
}

initializeGuildData();

document.getElementById('Guilds').addEventListener('change', function() {
    getScores()
    });
// Creates the users and calculates the guild scores
async function getScores(list = undefined /* Custom user list for "usernames" search bar */) {
    disableUI();

    console.log("Loading Users");

    const guilded = getAllGuildMembers(); // Default || Every known member of every known guild (excluding Guilded Guild, which was just for testing)
    const usernames = ((list) ? list : (document.getElementById('Guilds').value) ? Guilds[document.getElementById('Guilds').value].Members : guilded);
    console.log(usernames);
    const resultsDiv = document.getElementById("results");
    const guildInfo = document.getElementById("guildInfoContent");
    guildInfo.innerHTML = "";
    resultsDiv.innerHTML = "";

    guild = (document.getElementById('Guilds').value != "") ? document.getElementById('Guilds').value : "A/C"; // Name for guild info
    users = []; // Users in guild / are loaded
    guildScore = 0; // Total score
    guildPerformance = 0; // Custom performance system

    let performances = [];

    try {
        // Map each username to a promise that fetches user data
        const userPromises = usernames.map(async (profile) => {
            //console.log(profile.info.username)
            let index = 0;
            const trimmedUsername = profile.info.username.trim();
            const url = `${baseUrl}/users/full/${profile.info.username}`;
            const data = profile;
            const user = new User(data, url);
            user.id = profile.info.id;
            users.push(user);
            user.createUserUI();
            guildScore += user.totalScore;

            performances.push(user.overallPerformance);
            performances = performances.sort(function(a, b) {
                return b - a;
            });

            let tempPerformance = 0;
            performances.forEach((rating) => {
                const weighted = rating * Math.pow(0.97, index);
                tempPerformance += weighted;

                index++;
            });
            guildPerformance = tempPerformance;

            let playCount = 0;
            let totalAcc = 0;
            let totalHits = 0;
            users.forEach((user) => {
                playCount += user.playCount;
                totalAcc += user.overallAccuracy;
                totalHits += user.totalHits;
            });
            guildInfo.innerHTML =
                `
          <img class="guild-banner" src="${Guilds[document.getElementById('Guilds').value].Logo}">
          <h1>${(document.getElementById('Guilds').value != "") ? Guilds[document.getElementById('Guilds').value].Name : "All / Custom"} (${guild})</h1>
          <br><a class="guild-desc">${Guilds[document.getElementById('Guilds').value].Desc}</a>
          <br>
          <br><h2>Stats</h2>Overall Performance: ${formatNumber(guildPerformance)}
          <br>Overall Score: ${formatNumber(guildScore)}
          <br>Overall Acc: ${formatNumber(totalAcc / users.length, 4)}%
          <br>Members: ${formatNumber(users.length)}
          <br>Play Count: ${formatNumber(playCount)} (AVG: ${formatNumber(playCount/users.length)})
          <br>Notes Hit: ${formatNumber(totalHits)} (AVG: ${formatNumber(totalHits/users.length)})`;
            sortUsers(document.getElementById('sortSelect').value, this.value == "Ascending" ? 1 : -1);
        });

        // Wait for all user loading promises to resolve
        await Promise.all(userPromises);

        // Enable UI elements after loading is complete
        enableUI();
        const options = document.getElementsByClassName("option");
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.classList.contains("gone")) {
                option.classList.remove("gone");
            }
        }    
    } catch (error) {
        console.error("Error loading users:", error);
        resultsDiv.innerHTML += `<p class="user-score">Error loading users.</p>`;
    }
}


function getAllGuildMembers() {
    return Object.values(Guilds).flatMap(guild => guild.Members);
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

// Call this function to disable all selector/search options/buttons
function disableUI() {
    const elementsToDisable = document.querySelectorAll("#Guilds, #sortSelect, #ascdesc, #type, #usernames, button");
    elementsToDisable.forEach(element => {
        element.disabled = true;
        element.classList.add("disabled-btn"); // Add the custom class
    });
}

// Call this function to enable all selector/search options/buttons
function enableUI() {
    const elementsToEnable = document.querySelectorAll("#Guilds, #sortSelect, #ascdesc, #type, #usernames, button");
    elementsToEnable.forEach(element => {
        element.disabled = false;
        element.classList.remove("disabled-btn"); // Remove the custom class
    });
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

  document.getElementById('ascdesc').addEventListener('change', function() {
    sortUsers(document.getElementById('sortSelect').value, this.value == "Ascending" ? 1 : -1);
    });
  document.getElementById('sortSelect').addEventListener('change', function() {
    sortUsers(this.value, document.getElementById('ascdesc').value == "Ascending" ? 1 : -1);
    });
  function sortUsers(parameter, order = 1) {
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

function getValue(userElement, parameter) {
    const getTextContent = (element, selector) => {
        const selectedElement = element.querySelector(selector);
        return selectedElement ? selectedElement.textContent.trim() : '';
    };

    const parseSimplifiedNumber = (text) => {
        const numberPart = parseFloat(text);
        const multiplier = text.slice(-1).toLowerCase(); // Get the last character and make it lowercase

        if (isNaN(numberPart)) return NaN;

        console.log(multiplier)

        switch (multiplier) {
            case 'k':
                console.log("a")
                return numberPart * 1000;
            case 'm':
                console.log("b")
                return numberPart * 1000000;
            case 'b':
                console.log("c")
                return numberPart * 1000000000;
            default:
                console.log("d")
                return numberPart;
        }
    };

    switch(parameter) {
        case "Username":
            return getTextContent(userElement, '.user-name');
        case "Performance":
            return parseSimplifiedNumber(getTextContent(userElement, '.user-score p:nth-of-type(1)').split(':')[1]);
        case "Accuracy":
            return parseSimplifiedNumber(getTextContent(userElement, '.user-score p:nth-of-type(2)').split(':')[1]);
        case "Score":
            return parseSimplifiedNumber(getTextContent(userElement, '.user-score p:nth-of-type(3)').split(':')[1].split(' (')[0]);
        case "Plays":
            return parseSimplifiedNumber(getTextContent(userElement, '.user-score p:nth-of-type(3)').split('(')[1].split(' p')[0]);
        case "Rating":
            return parseSimplifiedNumber(userElement.querySelector('div:nth-of-type(3)').querySelector('p:nth-of-type(1)').innerText.split(':')[1]);
        case "Bonus":
            return parseSimplifiedNumber(userElement.querySelector('div:nth-of-type(3)').querySelector('p:nth-of-type(2)').innerText.split(':')[1]);
        case "Consistency":
            return parseSimplifiedNumber(userElement.querySelector('div:nth-of-type(3)').querySelector('p:nth-of-type(3)').innerText.split(':')[1]);
        case "Value":
            return parseSimplifiedNumber(userElement.querySelector('div:nth-of-type(3)').querySelector('p:nth-of-type(4)').innerText.split(':')[1]);
        default:
            return 0;
    }
}

// User data
class User {
    constructor(data, url, guild) {
        // Info
        this.id = 0;
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
        // AccuracyStuff
        this.hmarvs = data.keys4.stats.total_marv;
        this.hperfs = data.keys4.stats.total_perf;
        this.hgreats = data.keys4.stats.total_great;
        this.hgoods = data.keys4.stats.total_good;
        this.hokays = data.keys4.stats.total_okay;
        this.hmisses = data.keys4.stats.total_miss;
        this.totalHits = this.hmarvs + this.hperfs + this.hgreats + this.hgoods + this.hokays + this.hmisses;
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
        const onlineStatusPromise = this.fetchOnlineStatus(); // Initiate fetch asynchronously
        
        results.innerHTML += 
        `<div class="user box-shadow">
            <div class="user-info-basic box-shadow">
                <img class="user-pfp box-shadow" src="${this.pfp}">
                <div id="status${this.id}" class="user-status" style="background-color: red;" title="Online status is being fetched"></div>
                <a class="user-name " href="${this.profile}">
                    ${this.username}
                </a>
                <a>
                    (${(getRank(this.overallPerformance)[0] == "Herald" && getAccuracyRank(this.overallAccuracy)[0] == "Sage") ? "Monarch" : getRank(this.overallPerformance * (this.overallAccuracy + 2) / 100)[0]})
                </a>
            </div>
            <div class="user-score">
                <p> Performance : ${formatNumber(this.overallPerformance, 4)}p (${getRank(this.overallPerformance)[0]} ${formatNumber(Math.floor(this.overallPerformance), 0) == "727" ? "WYSI" : ""}) </p>
                <p> Accuracy : ${formatNumber(this.overallAccuracy, 4)}% (${getAccuracyRank(this.overallAccuracy)[0]}) </p>
                <p> Score : ${formatNumber(this.rankedScore)} <a>(${formatNumber(this.playCount)} plays)</a> </p>
            </div>
            <div class="user-score">
                <p> Rating : ${formatNumber(this.rating)} </p>
                <p> Bonus : ${formatNumber(this.bonus)} </p>
                <p> consistency : ${formatNumber(this.consistency)} </p>
                <p> Value : ${formatNumber(this.val)} </p>
            </div>
            <div class="user-score">
                <p> Notes hit : ${formatNumber(this.totalHits)}</p>
            </div>
        </div>`;
    
        onlineStatusPromise.then(onlineStatus => {
            console.log(onlineStatus.is_online)
            const userStatus = document.querySelector(`#status${this.id}`);
            if (userStatus) {
                userStatus.style.backgroundColor = onlineStatus.is_online ? "green" : "red";
                userStatus.title = onlineStatus.is_online ? `User is online\n${onlineStatus.current_status.content}` : "User is offline";
            }
        }).catch(error => {
            console.error("Error fetching online status for", this.username, error);
        });
    }
    
    async fetchOnlineStatus() {
        try {
            const response = await fetch(`https://api.quavergame.com/v1/server/users/online/${this.id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching online status for", this.username, error);
            return false; // Default to false if there's an error
        }
    }
}
