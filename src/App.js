import * as React from "react";
import './App.css';
import { ProfileCard } from './components/ProfileCard';
import { SearchBar } from './components/SearchBar';
import { apiCall } from "./functions/apiCall";

const getUsersByGuild = async () => {
  return await apiCall("https://api.cyphemercury.online/data.json")
}

const guilds = await getUsersByGuild();

function App() {
  // const testUser = require('./testUser.json')
  let userList = [];
  console.log(Object.keys(guilds).length)
  Object.keys(guilds).map(elem => {
    if (guilds[elem].Members.length > 0) {
      userList.push(...guilds[elem].Members)
      console.log(`${elem}: added ${guilds[elem].Members.length} users to the list`)
    } else {
      console.log(`Guild ${elem} is empty.`)
    }
  })

  // Iterate over the data json file passed in and add ProfileCards for all users
  let userCards = [];
  for (let i = 0; i < userList.length; i++) {
    userCards[i] = <ProfileCard data={userList[i]} />
  }

  return (
    <div className="App">
      <SearchBar></SearchBar>
      {userCards.length > 0 ? userCards : "error with da users"}
    </div>
  );
}

export default App;
