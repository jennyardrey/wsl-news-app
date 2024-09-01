import React, { useState } from 'react';
import styles from '../styles/Landing.module.scss';

function Landing({onPreferencesSaved}) {
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const teamList = ['Arsenal', 'Aston Villa', 'Bright & Hove Albion', 'Chelsea', 'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United', 'Tottenham Hotspur', 'West Ham United']
  
  const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams.includes(value)) {
        return prevSelectedTeams.filter((team) => team !== value);
      }
      return [...prevSelectedTeams, value];
    });
  };


  const handleGameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSelectedGames((prevSelectedGames) => {
      if (prevSelectedGames.includes(value)) {
        return prevSelectedGames.filter((team) => team !== value);
      }
      return [...prevSelectedGames, value];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission of the form
    sessionStorage.setItem('selectedTeams', JSON.stringify(selectedTeams));
    sessionStorage.setItem('selectedGames', JSON.stringify(selectedGames));
    onPreferencesSaved();
    // Save preferences logic goes here
  };

  return (
    <>
    <h1 className={styles.title}>Welcome to Spoiler Free WSL News!</h1>
    <section className={styles.intro}>
    <p>Want to find news about a match from the weekend without spoiling any of the others? Want to read articles from last week without spoiling this weeks scores? Want to find full match videos without seeing the score along the way?</p>
    <p>Select teams or matches you want to avoid below to read news and see highlights and results from all the matches and teams <i>except</i> those!</p>
    <p>You will also find links to full matches on Youtube.</p>
    </section>

    <form onSubmit={handleSubmit} className={styles.preferencesForm}>
  <h2>Select Teams to Hide</h2>
  {teamList.map(team => <label>
    <input onChange={handleTeamChange} type="checkbox" name="teams" value={team} /> {team}
  </label>)}

  <h2>Select Games to Hide</h2>
  <label>
    <input onChange={handleGameChange} type="checkbox" name="games" value="game1" /> Team 1 vs Team 2 (Date)
  </label>
  <label>
    <input onChange={handleGameChange} type="checkbox" name="games" value="game2" /> Team 3 vs Team 4 (Date)
  </label>
  <label>
    <input onChange={handleGameChange} type="checkbox" name="games" value="game3" /> Team 5 vs Team 6 (Date)
  </label>

  <button type="submit">Save Preferences</button>
</form>
</>
  );
}

export default Landing;
