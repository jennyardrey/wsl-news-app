import React, { useState, useEffect } from "react";
import { useAppState } from "../AppState.tsx";
import styles from '../styles/Videos.module.scss';

// Define the video categories
const VideoCategories = {
  FULL_MATCHES: 'Full Matches',
  HIGHLIGHTS: 'Highlights',
  OTHERS: 'Others',
};

function Video() {
  const { state, dispatch } = useAppState();
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState(VideoCategories.FULL_MATCHES);

  useEffect(() => {
    // Dispatch categorize videos action
    if (state.videos && state.videos.length > 0) {
      dispatch({ type: 'CATEGORISE_VIDEOS', payload: state.videos });
    }
  }, [dispatch, state.videos]);

  useEffect(() => {
    // Load initial videos from categorized list if available
    if (state.categorisedVideos) {
      setVisibleVideos(getVideosByCategory(activeCategory, state.categorisedVideos).slice(0, 2));
    }
  }, [state.categorisedVideos, activeCategory]);

  const loadMoreVideos = () => {
    if (state.categorisedVideos) {
      const nextIndex = visibleVideos.length + 2;
      setVisibleVideos(getVideosByCategory(activeCategory, state.categorisedVideos).slice(0, nextIndex));
    }
  };

  const getVideosByCategory = (category, videos) => {
    switch (category) {
      case VideoCategories.FULL_MATCHES:
        return videos.fullMatch || [];
      case VideoCategories.HIGHLIGHTS:
        return videos.highlights || [];
      case VideoCategories.OTHERS:
        return videos.others || [];
      default:
        return [];
    }
  };

  if (!state.videos) {
    return <div>Loading...</div>; // Render loading indicator while data is being fetched
  } else if (state.error) {
    return <div>Error: {state.error}</div>; // Render error message if there's an error
  }

  return (
    <div className={styles.videoContainer}>
      <h2>Football Videos</h2>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveCategory(VideoCategories.FULL_MATCHES)}
          className={activeCategory === VideoCategories.FULL_MATCHES ? styles.activeTab : ''}
        >
          Full Matches
        </button>
        <button
          onClick={() => setActiveCategory(VideoCategories.HIGHLIGHTS)}
          className={activeCategory === VideoCategories.HIGHLIGHTS ? styles.activeTab : ''}
        >
          Highlights
        </button>
        <button
          onClick={() => setActiveCategory(VideoCategories.OTHERS)}
          className={activeCategory === VideoCategories.OTHERS ? styles.activeTab : ''}
        >
          Others
        </button>
      </div>

      <div>
        {visibleVideos.map((el, i) => (
          <div key={i} className={styles.videoWrapper}>
            <div>{el.title}</div>
            <p>
              <iframe
                className={styles.videoIframe}
                width="560"
                height="315"
                src={el.videoId}
                title={el.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </p>
          </div>
        ))}
      </div>

      {/* Button to load more videos */}
      {state.categorisedVideos &&
        visibleVideos.length < getVideosByCategory(activeCategory, state.categorisedVideos).length && (
          <button onClick={loadMoreVideos}>Load More Videos</button>
        )}
    </div>
  );
}

export default Video;
