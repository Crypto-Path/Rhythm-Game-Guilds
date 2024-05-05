import './App.css';
import { ProfileCard } from './components/ProfileCard';

function App() {
  const testUser = require('./testUser.json')
  return (
    <div className="App">
      <ProfileCard data={testUser} />
    </div>
  );
}

export default App;
