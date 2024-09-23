import React from "react";
import { useAppState } from "../AppState.tsx";
import styles from  '../styles/News.module.scss';

function News() {
    const { state } = useAppState();

    if (!state.news) {
        return <div>Loading...</div>; // Render loading indicator while data is being fetched
    } else if (state.error) {
        return <div>Error: {state.error}</div>; // Render error message if there's an error
    }
        return ( 
            <div className={styles.news_container}>
                <h2>Football News</h2>
                <p>Some news from around the web:</p>
               
                {state.news.map((el, i) => (
                    <div className={styles.news_article} key={i} >
                        <a className={styles.news_link} href={el.link} target="_blank" rel="noreferrer">
                            <img src={el.image} alt={el.headline} className={styles.news_image} />
                            <div className={styles.news_content}>
                                <h3 className={styles.news_headline}>{el.headline}</h3>
                                <p className={styles.news_date}>{el.date}</p>
                                <summary className={styles.news_summary}>{el.summary}</summary>
                            </div>
                        </a>
                    </div>
            ))
            }
            </div>
         )
        
}
 
export default News;