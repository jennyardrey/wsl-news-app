import React from "react";
import { useAppState } from "../AppState.tsx";
import styles from  '../styles/Home.module.scss';

function News() {
    const { state, dispatch } = useAppState();

    if (!state.news) {
        return <div>Loading...</div>; // Render loading indicator while data is being fetched
    } else if (state.error) {
        return <div>Error: {state.error}</div>; // Render error message if there's an error
    }
console.log(state.news)
        return ( 
            <div>
                <h2>Football News</h2>
                <p>Some news from around the web:</p>
               
                {state.news.map((el, i) => (
                    <div key={i} >{el.headline}</div>
            ))
            }
            </div>
         )
        
}
 
export default News;