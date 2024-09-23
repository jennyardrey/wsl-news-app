import React from "react";
import { useAppState } from "../AppState.tsx";
import styles from '../styles/Table.module.scss';
import clsx from 'clsx';

function Table() {
    const { state, dispatch } = useAppState();
    
    if (!state.standings) {
        return <div className={styles.loading}>Loading...</div>;
    } else if (state.error) {
        return <div className={styles.error}>Error: {state.error}</div>;
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

    return ( 
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <img src={state.standings.response[0].league.logo} alt='logo' className={styles.leagueLogo} />
                <h2>{state.standings.response[0].league.name}</h2>
            </div>
            <div className={styles.table}>
                <div className={`${styles.tableRow} ${styles.tableHeaderRow}`}>
                    <div className={styles.tableCell}>Rank</div>
                    <div className={`${styles.tableCell} ${styles.teamCell}`}>Team</div>
                    <div className={styles.tableCell}>Points</div>
                    <div className={styles.tableCell}>GD</div>
                </div>
                {state.standings.response[0].league.standings[0].map(el => (
                    <div key={el.rank} className={styles.tableRow}>
                        <div className={styles.mobileColumns}>
                            <div className={styles.mobileColumn}>
                                <div className={`${styles.tableCell} ${styles.rankCell}`} data-label="Rank">
                                    {getRankWithSuffix(el.rank)}
                                </div>
                                <div className={`${styles.tableCell} ${styles.teamCell}`} data-label="Team">
                                    <img src={el.team.logo} alt={el.team.name} className={clsx(styles.teamLogo, styles.mobileTeamLogo)} />
                                    {el.team.name}
                                </div>
                                <div className={styles.tableCell} data-label="Points">{el.points}</div>
                                <div className={styles.tableCell} data-label="GD">{el.goalsDiff}</div>
                            </div>
                            <div className={`${styles.mobileColumn} ${styles.logoColumn}`}>
                                <img src={el.team.logo} alt={el.team.name} className={styles.teamLogo} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Table;
