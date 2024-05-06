import * as React from "react";
import './App.css';
import { ProfileCard } from './components/ProfileCard';
import { SearchBar } from './components/SearchBar';
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
          usersToAdd = await Promise.all(userSearchResults.map(async elem => {
            const userData = await apiCall(`https://api.quavergame.com/v1/users/full/${elem.id}`);
            return userData.user;
          }));
        } else {
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
      <SearchBar query={userSearchQuery} setQuery={setUserSearchQuery} results={userSearchResults} setResults={setUserSearchResults}></SearchBar>
      <br />
      {userList.length > 0 ? (
        userList.map(user => <ProfileCard key={user.id} data={user} />)
      ) : "error with da users"}
    </div>
  );
}

export default App;
