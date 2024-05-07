import * as React from "react";
import './App.css';
import { ProfileCard } from './components/ProfileCard';
import { GuildPanel } from './components/GuildPanel';
import { SearchBar } from './components/SearchBar';
import { Background } from './components/Background';
import { apiCall } from "./functions/apiCall";

const getUsersByGuild = async () => {
  return await apiCall("https://api.cyphemercury.online/data.json")
}

function App() {
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const guildsData = await getUsersByGuild();
        let usersToAdd = [];
        if (userSearchResults.length > 0) {
          console.log("User Search Results:", userSearchResults)
          usersToAdd = await Promise.all(userSearchResults.map(async elem => {
            const userData = await apiCall(`https://api.quavergame.com/v1/users/full/${elem.id}`);
            return userData.user;
          }));
        } else {
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
          usersToAdd = Object.values(guildsData).flatMap(guild => guild.Members);
        }
        setUserList(usersToAdd);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userSearchResults]);

  return (
    <div className="App">
      <Background></Background>
      <SearchBar query={userSearchQuery} setQuery={setUserSearchQuery} results={userSearchResults} setResults={setUserSearchResults}></SearchBar>
      <br />
      <div className="container-guild">
        <div className="userList">
          {userList.length > 0 ? (
            userList.map(user => <ProfileCard key={user.id} data={user} />)
          ) : "error with da users"}
        </div>
        <GuildPanel></GuildPanel>
      </div>
    </div>
  );
}

export default App;
