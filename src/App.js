import './App.css';
import React  from 'react';
import { AppStateProvider } from './AppState.tsx';
import Home from "./pages/Home.tsx"


    function App() {
      return (
        <AppStateProvider>
          <Home />
        </AppStateProvider>
      );
    }
  
export default App;
