import React, { useState, useEffect, useRef } from "react";
import { useAppState } from "../AppState.tsx";
import styles from '../styles/Videos.module.scss';
import { debounce } from 'lodash'; // Add this import


// Define the video categories
const VideoCategories = {
  FULL_MATCHES: 'Full Matches',
  HIGHLIGHTS: 'Highlights',
};


function Video() {
  const { state, dispatch } = useAppState();
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState(VideoCategories.FULL_MATCHES);

  const tabsRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({});

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

  useEffect(() => {
    const updateSliderPosition = () => {
      if (tabsRef.current) {
        const activeTab = tabsRef.current.querySelector(`.${styles.activeTab}`);
        if (activeTab) {
          setSliderStyle({
            width: `${activeTab.offsetWidth}px`,
            left: `${activeTab.offsetLeft}px`,
          });
        }
      }
    };

    // Update slider position initially and when active category changes
    updateSliderPosition();

    // Create a debounced version of updateSliderPosition
    const debouncedUpdateSliderPosition = debounce(updateSliderPosition, 250);

    // Add event listener for window resize
    window.addEventListener('resize', debouncedUpdateSliderPosition);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', debouncedUpdateSliderPosition);
    };
  }, [activeCategory]);

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
      default:
        return [];
    }
  };

  return (
    <div className={styles.videoContainer}>
      <h2>Football Videos</h2>

      <div className={styles.tabs} ref={tabsRef}>
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
          Highlights and Extras
        </button>
        <div className={styles.slider} style={sliderStyle}></div>
      </div>

      <div className={styles.videoGrid}>
        {visibleVideos.map((el, i) => (
          <a 
            key={i} 
            href={`https://www.youtube.com/watch?v=${getYouTubeID(el.videoId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.videoCard}
          >
            <div className={styles.thumbnailContainer}>
              <img 
                src={`https://img.youtube.com/vi/${getYouTubeID(el.videoId)}/0.jpg`} 
                alt={el.title}
                className={styles.thumbnail}
              />
              <div className={styles.playButton}>▶</div>
            </div>
            <div className={styles.videoTitle}>{el.title}</div>
          </a>
        ))}
      </div>

      {/* Button to load more videos */}
      {state.categorisedVideos &&
        visibleVideos.length < getVideosByCategory(activeCategory, state.categorisedVideos).length && (
          <button className={styles.loadMoreButton} onClick={loadMoreVideos}>Load More Videos</button>
        )}
    </div>
  );
}

// Helper function to extract YouTube video ID
function getYouTubeID(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default Video;
