
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useAppState } from '../AppState.tsx';
import Table from './Table.tsx';
import News from './News.tsx';
import Video from './Video.tsx';

function Home() {
    const { state, dispatch } = useAppState();

    // Conditional rendering to handle different states
    if (!state) {
        return <div>Loading...</div>; // Render loading indicator while data is being fetched
    } else if (state.error) {
        return <div>Error: {state.error}</div>; // Render error message if there's an error
    }

    return (
        <div>
            <Tabs selectedIndex={state.tabIndex} onSelect={index => dispatch({ type: 'SET_TAB_INDEX', payload: index })}>
                <TabList>
                    <Tab>Table</Tab>
                    <Tab>News</Tab>
                    <Tab>Video</Tab>
                </TabList>

                <TabPanel>
                   <Table />
                </TabPanel>
                <TabPanel>
                    <h2>News Section</h2>
                    <News />
                </TabPanel>
                <TabPanel>
                    <h2>Video Section</h2>
                    <Video />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default Home;
