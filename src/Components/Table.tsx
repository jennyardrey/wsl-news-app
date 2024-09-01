import React from "react";
import { useAppState } from "../AppState.tsx";
import styles from '../styles/Table.module.scss';

function Table() {
    const { state, dispatch } = useAppState();
    console.log('state: ', state)
    if (!state.standings) {
        return <div>Loading...</div>; // Render loading indicator while data is being fetched
    } else if (state.error) {
        return <div>Error: {state.error}</div>; // Render error message if there's an error
    }

    const getRankWithSuffix = (rank) => {
        if (rank % 10 === 1 && rank % 100 !== 11) {
            return `${rank}st`;
        } else if (rank % 10 === 2 && rank % 100 !== 12) {
            return `${rank}nd`;
        } else if (rank % 10 === 3 && rank % 100 !== 13) {
            return `${rank}rd`;
        } else {
            return `${rank}th`;
        }
    };

    console.log('state: ', state)

    return ( 
        <div className={styles.tableContainer}>
            <h2>League Table</h2>
            <p>The table as it stands:</p>
            <img src={state.standings.response[0].league.logo} alt='logo' className={styles.leagueLogo} />
            <div className={styles.leagueName}>{state.standings.response[0].league.name}</div>
            <div className={styles.table}>
                <div className={`${styles.tableRow} ${styles.tableHeader}`}>
                    <div className={styles.tableCell}>Rank</div>
                    <div className={styles.tableCell}>Team</div>
                    <div className={styles.tableCell}>Points</div>
                    <div className={styles.tableCell}>Goal Difference</div>
                </div>
                {state.standings.response[0].league.standings[0].map(el => (
                    <div key={el.rank} className={styles.tableRow}>
                        <div className={styles.tableCell}>{getRankWithSuffix(el.rank)}</div>
                        <div className={styles.tableCell}>{el.team.name}</div>
                        <div className={styles.tableCell}>{el.points}</div>
                        <div className={styles.tableCell}>{el.goalsDiff}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Table;
