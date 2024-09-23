import React from 'react';
import { useAppState } from '../AppState.tsx';
import Table from './Table.tsx';
import News from './News.tsx';
import Video from './Video.tsx';
import styles from '../styles/Dashboard.module.scss';

function Dashboard() {
    const { state, dispatch } = useAppState();

    const setActiveTab = (index) => {
        dispatch({ type: 'SET_TAB_INDEX', payload: index });
    };

    if (!state) {
        return <div>Loading...</div>;
    } else if (state.error) {
        return <div>Error: {state.error}</div>;
    }

    return (
        <div className={styles.dashboard}>
            <nav className={styles.navbar}>
                <ul className={styles.navList}>
                    <li className={`${styles.navItem} ${state.tabIndex === 0 ? styles.active : ''}`}>
                        <button onClick={() => setActiveTab(0)}>Video</button>
                    </li>
                    <li className={`${styles.navItem} ${state.tabIndex === 1 ? styles.active : ''}`}>
                        <button onClick={() => setActiveTab(1)}>Table</button>
                    </li>
                    <li className={`${styles.navItem} ${state.tabIndex === 2 ? styles.active : ''}`}>
                        <button onClick={() => setActiveTab(2)}>News</button>
                    </li>
                </ul>
            </nav>

            <div className={styles.content}>
                {state.tabIndex === 0 && <Video />}
                {state.tabIndex === 1 && <Table />}
                {state.tabIndex === 2 && <News />}
            </div>
        </div>
    );
}

export default Dashboard;