import * as React from "react";
import './App.css';
import { ProfileCard } from './components/ProfileCard';

function App() {
  const testUser = require('./testUser.json')
  
  // Iterate over the data json file passed in and add ProfileCards for all users
  let userCards = [];
  for (let i = 0; i < testUser.length; i++) {
    userCards[i] = <ProfileCard data={testUser[i]} />
  }

  return (
    <div className="App">
      {userCards ? userCards : "error with da users"}
    </div>
  );
}

export default App;
