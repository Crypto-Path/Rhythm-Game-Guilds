import * as React from "react";
import { apiCall } from "./functions/apiCall";
import { Background, GuildPanel, InfoPanel, Loading, ProfileCard, SearchContainer } from "./components/index";
import { filterUsersCX } from "./components/context";

const getUsersByGuild = async () => {
  return await apiCall("https://api.cyphemercury.online/data.json")
}

function App() {
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [sortBy, setSortBy] = React.useState("Username");
  const guildKeys = React.useRef([]);
  const guildsData = React.useRef({});
  const guildPanelObj = React.useRef({
    banner: "https://api.cyphemercury.online/images/RRG_Banner.png",
    name: "Rhythm Game Guilds",
    description: "Welcome to Rhythm Game Guilds!"
  })

  getUsersByGuild().then(res => guildsData.current = res)
  
  React.useEffect(() => {
    // This function is for adding guild identifiers to searched users
    const addGuildKey = (guildsObject, user) => {
      let targetGk = "";
        if (Object.keys(guildsObject).find(gk => {
            targetGk = gk;
            return guildsObject[gk].Members.find((m, mi, ma) => ma[mi].info.id === user.info.id);
          })) {
          user.guild = targetGk;
        } else {
          user.guild = "";
        }
    }

    const fetchUsers = async () => {
      try {
        guildKeys.current = Object.keys(guildsData.current)
        let usersToAdd = [];
        if (userSearchResults.length > 0) {
          console.log("User Search Results:", userSearchResults)
          usersToAdd = await Promise.all(userSearchResults.map(async elem => {
            const userData = await apiCall(`https://api.quavergame.com/v1/users/full/${elem.id}`);
            addGuildKey(guildsData.current, userData.user)
            return userData.user;
          }));
          document.querySelectorAll(".filter").forEach(e => {
            if (e.firstChild.textContent === "Guild:") e.childNodes[1].childNodes.forEach(c => {
              if (c.classList.contains("selected")) c.classList.remove("selected");
              if (c.textContent === "All" && !c.classList.contains("selected")) c.classList.add("selected"); 
            })
          })
        } else {    // The below is ran if there is no search query as the "default" return.
          /* TODO:
           * [X] Get guild members from either all guilds, or on specific guild
           * [X] Set up another "class" object thingy? for Listing, Sorting, and Grouping
           * [X] Listing: What is shown
           * [X] Sorting: highest to lowest
           * [X] Grouping: separated into segments ( [Highest to Lowest] 761 921 831 431 )
           * 
           * Possibly set up a function that takes the listed users and sorts them so searched users and guilded users can be sorted/grouped the same way
           * 
           * Using this as a marker so I can remember where the main guilds listing is
           */
          
          // Add the guild identifier to the user object:
          Object.keys(guildsData.current).forEach((g, i) => {
            guildsData.current[g].Members.forEach((m, mi, ma) => {
              if (typeof ma[mi] === "object") {
                ma[mi].guild = Object.keys(guildsData.current)[i]
              } else {
                console.debug(`Error with user '${m}. Removed from the userlist.`)
                ma.splice(mi, 1);
              }
            })
          })

          usersToAdd = Object.values(guildsData.current).flatMap(guild => guild.Members);
        }
        setUserList(usersToAdd);
        setFilteredUsers(usersToAdd);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userSearchResults]);

  // ...Sorts the users. Based on what you click. lol
  const sortUsers = (v, o = true) => {
    switch (v) {
      case "Username": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const usernameA = a.info.username;
          const usernameB = b.info.username;
          return o ? usernameA.localeCompare(usernameB) : usernameB.localeCompare(usernameA);
        })]);
        break;
      } case "Performance": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const performanceA = a.keys4.stats.overall_performance_rating;
          const performanceB = b.keys4.stats.overall_performance_rating;
          return o ? performanceA - performanceB : performanceB - performanceA;
        })]);
        break;
      } case "Accuracy": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const accuracyA = a.keys4.stats.overall_accuracy;
          const accuracyB = b.keys4.stats.overall_accuracy;
          return o ? accuracyA - accuracyB : accuracyB - accuracyA;
        })]);
        break;
      } case "Score": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const scoreA = a.keys4.stats.ranked_score;
          const scoreB = b.keys4.stats.ranked_score;
          return o ? scoreA - scoreB : scoreB - scoreA;
        })]);
        break;
      } case "Play Count": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const pcA = a.keys4.stats.play_count;
          const pcB = b.keys4.stats.play_count;
          return o ? pcA - pcB : pcB - pcA;
        })]);
        break;
      } case "Rating": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const ratingA = Math.pow(a.keys4.stats.overall_accuracy / 98, 6) * a.keys4.stats.overall_performance_rating;
          const ratingB = Math.pow(b.keys4.stats.overall_accuracy / 98, 6) * b.keys4.stats.overall_performance_rating;
          return o ? ratingA - ratingB : ratingB - ratingA;
        })]);
        break;
      } case "Bonus": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const bonusA = 1 + a.keys4.stats.count_grade_x * 0.2 + a.keys4.stats.count_grade_ss * 0.05 + a.keys4.stats.count_grade_s * 0.01;
          const bonusB = 1 + b.keys4.stats.count_grade_x * 0.2 + b.keys4.stats.count_grade_ss * 0.05 + b.keys4.stats.count_grade_s * 0.01;
          return o ? bonusA - bonusB : bonusB - bonusA;
        })]);
        break;
      } case "Consistency": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const consA = Math.log2(a.keys4.stats.play_count / (a.keys4.stats.fail_count + 1) * a.keys4.stats.max_combo);
          const consB = Math.log2(b.keys4.stats.play_count / (b.keys4.stats.fail_count + 1) * b.keys4.stats.max_combo);
          return o ? consA - consB : consB - consA;
        })]);
        break;
      } case "Value": {
        setFilteredUsers([...filteredUsers.sort((a, b) => {
          const valueA = (Math.pow(a.keys4.stats.overall_accuracy / 98, 6) * a.keys4.stats.overall_performance_rating) + (1 + a.keys4.stats.count_grade_x * 1 + a.keys4.stats.count_grade_ss * 0.05 + a.keys4.stats.count_grade_s * 0.01) * Math.log2(a.keys4.stats.play_count / (a.keys4.stats.fail_count + 1) * a.keys4.stats.max_combo);
          const valueB = (Math.pow(b.keys4.stats.overall_accuracy / 98, 6) * b.keys4.stats.overall_performance_rating) + (1 + b.keys4.stats.count_grade_x * 1 + b.keys4.stats.count_grade_ss * 0.05 + b.keys4.stats.count_grade_s * 0.01) * Math.log2(b.keys4.stats.play_count / (b.keys4.stats.fail_count + 1) * b.keys4.stats.max_combo);
          return o ? valueA - valueB : valueB - valueA;
        })]);
        break; 
      }
      
      default: {
        setFilteredUsers([...filteredUsers.sort((a, b) => a.info.username.localeCompare(b.info.username))]);
      }
    }

  }

  // This is effectively the onclick handler.
  // It could probably use a better name, though we'll have to update
  // the CX handler too. At that point we would want to break the filter
  // itself out into its own filterUsers function.
  const filterUsers = e => {
    const key = e.target.parentNode.previousSibling.textContent;
    const value = e.target.textContent;
    e.target.parentNode.childNodes.forEach(child => child.classList.contains("selected") && child.classList.remove("selected"));
    e.target.classList.add("selected");
  
    switch (key) {
        case "Guild:": {
          switch (value) {
            case "All": {
              _buildGuildPanelObj("")
              setFilteredUsers(userList);
              break;
            } default: {
                _buildGuildPanelObj(value)
                setFilteredUsers(userList.filter(user => user.guild === value));
                break;
            }
          }
          break;
        } case "Sort by:": {
          setSortBy(value);
          sortUsers(value);
          break;
        } case "Order:": {
          switch (value) {
            case "Descending": {
              sortUsers(sortBy, false);
              break;
            }

            default: {
              sortUsers(sortBy);
            }
          }
          break;
        }

        default: {
          setFilteredUsers(userList.sort((a, b) => a.info.username.localeCompare(b.info.username)));
        }
    }
  }

  // Build the guild obj to pass to the GuildPanel later

  const _buildGuildPanelObj = (guildKey) => {
    guildPanelObj.current = {
      banner: guildsData.current[guildKey].Banner,
      name: guildsData.current[guildKey].Name,
      description: guildsData.current[guildKey].Desc
    };
  }

  return (
    <div className="App">
      <Background />
      <InfoPanel />
      <filterUsersCX.Provider value={filterUsers}>
        <SearchContainer query={userSearchQuery}
                        setQuery={setUserSearchQuery}
                        setResults={setUserSearchResults}
                        guildKeys={guildKeys.current} />
      </filterUsersCX.Provider>
      <div className="container-guild main-element">
        <div className="userList">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => <ProfileCard key={user.id} data={user} />)
          ) : <Loading /> }
        </div>
        <div className="flexprot">
          <GuildPanel guildInfo={guildPanelObj.current} userList={filteredUsers}></GuildPanel>
        </div>
      </div>
    </div>
  );
}

export default App;
