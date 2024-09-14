
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useAppState } from '../AppState.tsx';
import Table from '../components/Table.tsx';
import News from '../components/News.tsx';
import Video from '../components/Video.tsx';

function Dashboard() {
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
                    <News />
                </TabPanel>
                <TabPanel>
                    <Video />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default Dashboard;
