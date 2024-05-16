import logo from './logo.svg';
import './App.css';

import axios  from 'axios';
const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
  params: {
    season: '2023',
    league: '44'
  },
  headers: {
    'X-RapidAPI-Key': '39b82871damsh553380b45309c17p14d219jsn01f1cf3822d6',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
