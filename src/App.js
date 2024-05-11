import * as React from "react";
import './App.css';
import { apiCall } from "./functions/apiCall";
import { Background, GuildPanel, ProfileCard, SearchContainer } from "./components/index";
import { filterUsersCX } from "./components/context";

const getUsersByGuild = async () => {
  return await apiCall("https://api.cyphemercury.online/data.json")
}

function App() {
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const guildKeys = React.useRef([])
  
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
        const guildsData = await getUsersByGuild();
        guildKeys.current = Object.keys(guildsData)
        let usersToAdd = [];
        if (userSearchResults.length > 0) {
          console.log("User Search Results:", userSearchResults)
          usersToAdd = await Promise.all(userSearchResults.map(async elem => {
            const userData = await apiCall(`https://api.quavergame.com/v1/users/full/${elem.id}`);
            addGuildKey(guildsData, userData.user)
            return userData.user;
          }));
        } else {    // The below is ran if there is no search query as the "default" return.
          /* TODO:
           * Get guild members from either all guilds, or on specific guild
           * Set up another "class" object thingy? for Listing, Sorting, and Grouping
           * - Listing: What is shown
           * - Sorting: highest to lowest
           * - Grouping: separated into segments ( [Highest to Lowest] 761 921 831 431 )
           * 
           * Possibly set up a function that takes the listed users and sorts them so searched users and guilded users can be sorted/grouped the same way
           * 
           * Using this as a marker so I can remember where the main guilds listing is
           */
          
          // Add the guild identifier to the user object:
          Object.keys(guildsData).forEach((g, i) => {
            guildsData[g].Members.forEach((m, mi, ma) => {
              ma[mi].guild = Object.keys(guildsData)[i]
            })
          })

          usersToAdd = Object.values(guildsData).flatMap(guild => guild.Members);
          setFilteredUsers(usersToAdd);
        }
        setUserList(usersToAdd);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userSearchResults]);

  const filterUsers = e => {
    const key = e.target.parentNode.previousSibling.textContent;
    const value = e.target.textContent;
  
    switch (key) {
        case "Guild:": {
          switch (value) {
            case "All": {
              setFilteredUsers(userList);
              break;
            } default: {
                setFilteredUsers(userList.filter(user => user.guild === value));
                break;
            }
          }
          break;
        }
        case "Sort by:": {
          console.debug(`Sort is not currently working. Thank you for selecting "${key} ${value}".`)
          break;
        }
        default: {
          setFilteredUsers(userList);
          break;
        }
    }
  }

  return (
    <div className="App">
      <Background />
      <filterUsersCX.Provider value={filterUsers}>
        <SearchContainer query={userSearchQuery}
                        setQuery={setUserSearchQuery}
                        setResults={setUserSearchResults}
                        guildKeys={guildKeys.current} />
      </filterUsersCX.Provider>
      <br />
      <div className="container-guild">
        <div className="userList">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => <ProfileCard key={user.id} data={user} />)
          ) : "error with da users"}
        </div>
        <GuildPanel></GuildPanel>
      </div>
    </div>
  );
}

export default App;
