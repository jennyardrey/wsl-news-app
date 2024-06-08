import React from "react";
import { useAppState } from "../AppState.tsx";
import styles from  '../styles/Home.module.scss';

function Table() {
    const { state, dispatch } = useAppState();

    if (!state.data) {
        return <div>Loading...</div>; // Render loading indicator while data is being fetched
    } else if (state.error) {
        return <div>Error: {state.error}</div>; // Render error message if there's an error
    }

        return ( 
            <div>
                <h2>League Table</h2>
                <p>The table as it stands:</p>
                <img src={state.data.response[0].league.logo} alt='logo' />
                <div>{state.data.response[0].league.name}</div>
                {state.data.response[0].league.standings[0].map(el => (
                    <div key={el.rank} className={styles.tableRow}>
                    <div className={styles.tableCell}>{el.rank}</div>
                    <div className={styles.tableCell}>{el.team.name}</div>
                    <div className={styles.tableCell}>{el.points}</div>
                    <div className={styles.tableCell}>{el.goalsDiff}</div>
                </div>
            
            ))
            }
            </div>
         )
        
}
 
export default Table;