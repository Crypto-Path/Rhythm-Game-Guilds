import './App.css';
import { ProfileCard } from './components/ProfileCard';

const getTestUser = async () => {
  const user = await fetch('https://api.cyphemercury.online/data.json')
  return user;
}

function App() {
  const testUser = require('./testUser.json')
  return (
    <div className="App">
      <ProfileCard data={testUser} />
    </div>
  );
}

export default App;
