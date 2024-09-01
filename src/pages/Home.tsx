import React, { useEffect, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import { useAppState } from '../AppState.tsx';
import Landing from '../components/Landing.tsx'; 
import Dashboard from '../components/Dashboard.tsx'; 

function Home() {
    const { state } = useAppState();

    // State to trigger re-render after form submission
    const [preferencesUpdated, setPreferencesUpdated] = useState(false);

    // Check session storage for user preferences on initial load
    useEffect(() => {
        const storedPreferences = sessionStorage.getItem('selectedTeams');
        if (storedPreferences && storedPreferences !== '[]') {
            setPreferencesUpdated(true);
        }
    }, []); // Empty dependency array ensures this runs only once on component mount

    // Function to handle form submission and trigger re-render
    const handlePreferencesSaved = () => {
        setPreferencesUpdated(true); // Toggle the state to trigger re-render
    };

    // Conditional rendering to handle different states
    if (!state) {
        return <div>Loading...</div>; // Render loading indicator while data is being fetched
    } else if (state.error) {
        return <div>Error: {state.error}</div>; // Render error message if there's an error
    }

    return (
        <div>
            {!preferencesUpdated ? (
                <Landing onPreferencesSaved={handlePreferencesSaved} />  // Pass the callback to Landing component
            ) : (
                <Dashboard />
            )}
        </div>
    );
}

export default Home;
