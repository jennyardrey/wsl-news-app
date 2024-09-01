import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect, useRef } from 'react';
import axios from 'axios';
import newsJson from "./content/news_data.json"
import videosJson from "./content/youtube_video_data.json"

// Define action types
type ActionType = 
  | { type: 'SET_TAB_INDEX'; payload: number }
  | { type: 'SET_FIXTURES_DATA'; payload: any }
  | { type: 'SET_STANDINGS_DATA'; payload: any }
  | { type: 'SET_NEWS'; payload: any }
  | { type: 'SET_VIDEOS'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CATEGORISE_VIDEOS'; payload: any };

// Define the initial state and its type
interface State {
  tabIndex: number;
  fixtures: any;
  standings: any;
  loading: boolean;
  error: string;
  news: any;
  videos: any;
  fullMatch: any;
  highlights: any;
  others: any;
  categorisedVideos: any;
}

const initialState: State = {
  tabIndex: 0,
  fixtures: null,
  standings: null,
  loading: false,
  error: '',
  news: null,
  videos: null,
  fullMatch: null,
  highlights: null,
  others: null,
  categorisedVideos: null
};

// Create the context
const AppStateContext = createContext<{
  state: State;
  dispatch: Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Define the reducer function
const appReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'SET_TAB_INDEX':
      return { ...state, tabIndex: action.payload };
    case 'SET_FIXTURES_DATA':
      return { ...state, fixtures: action.payload };
      case 'SET_STANDINGS_DATA':
        return { ...state, standings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NEWS':
      return { ...state, news: action.payload };
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    case 'CATEGORISE_VIDEOS':
      const fullMatch = action.payload.filter(video => video.title.includes('Full Match'));
      const highlights = action.payload.filter(video => video.title.includes('Highlights'));
      const others = action.payload.filter(video => !video.title.includes('Full Match') && !video.title.includes('Highlights'));
      return { ...state, categorisedVideos: { fullMatch, highlights, others } };
    default:
      return state;
  }
};

// Define the provider component
interface AppStateProviderProps {
  children: ReactNode;
}

// Explicitly define the AppStateProvider as a React Functional Component
export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isDataFetched = useRef(false); // Reference to indicate if data has been fetched

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        let storedData = sessionStorage.getItem('apiData');
        console.log('storedData', Boolean(storedData), 'isDataFetched', isDataFetched.current);
        
        if (storedData) {
          // If data exists in local storage
          const parsedData = JSON.parse(storedData);
          console.log(parsedData);
          dispatch({ type: 'SET_DATA', payload: parsedData });
        } else {
          // Otherwise, fetch data from the API
          console.log('Deffo fetching');
          const todaysDate = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(todaysDate.getDate() - 7);
          const formattedToday = todaysDate.toISOString().split('T')[0];
          const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];
          console.log(formattedToday,formattedSevenDaysAgo )
          const responseStandings = await axios.request({
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
            params: { season: '2024', league: '44' },
            headers: {
              'X-RapidAPI-Key': '39b82871damsh553380b45309c17p14d219jsn01f1cf3822d6',
              'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
            },
          });
          console.log('API Response1:', responseStandings); // Log API response
          dispatch({ type: 'SET_STANDINGS_DATA', payload: {...responseStandings.data, }})
          const responseFixtures = await axios.request({
            method: 'GET', 
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { season: '2024', league: '44', from: `${formattedToday}`, to:`${formattedSevenDaysAgo}` },
            headers: {
              'X-RapidAPI-Key': '39b82871damsh553380b45309c17p14d219jsn01f1cf3822d6',
              'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
            },
          })
          console.log('API Response2:', responseFixtures); // Log API response
          const combinedData = {
            standings: responseStandings.data,
            fixtures: responseFixtures.data
          }
          dispatch({ type: 'SET_FIXTURES_DATA', payload: {...responseFixtures.data} });
          sessionStorage.setItem('apiData', JSON.stringify({combinedData})); // Store data in local storage

        }

        isDataFetched.current = true;

        if (newsJson) {
          dispatch({ type: 'SET_NEWS', payload: newsJson });
        }
        if (videosJson) {
          console.log(videosJson)
          dispatch({ type: 'SET_VIDEOS', payload: videosJson });
        }
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    if (!isDataFetched.current) {
      fetchData();
    }
  }, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to use the AppStateContext
export const useAppState = () => {
  return useContext(AppStateContext);
};
