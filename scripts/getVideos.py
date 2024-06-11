from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, NoSuchElementException
import json
import time

def extract_youtube_data(channel_url):
    # Set up Chrome WebDriver
    options = Options()
    options.headless = True  # Run Chrome in headless mode (without opening the browser window)
    service = Service('/usr/local/bin/chromedriver')  # Specify the path to your Chrome WebDriver
    driver = webdriver.Chrome(service=service, options=options)
    
    # Navigate to the YouTube channel page
    driver.get(channel_url)
    
    # Accept cookies if the button appears
    try:
        consent_button_xpath = "//button[@aria-label='Accept all']"
        consent = WebDriverWait(driver, 30).until(EC.element_to_be_clickable((By.XPATH, consent_button_xpath)))
        consent.click()
    except NoSuchElementException:
        print("No consent button found, proceeding without clicking consent.")
    except Exception as e:
        print("Unable to click the consent button:", e)

    # Scroll to load more videos
    last_height = driver.execute_script("return document.documentElement.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
        time.sleep(2)  # Wait for the page to load
        new_height = driver.execute_script("return document.documentElement.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
    
    # Find all video titles and URLs
    video_data = []
    retry_attempts = 3

    for _ in range(retry_attempts):
        try:
            video_elements = WebDriverWait(driver, 30).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'ytd-rich-grid-media'))
            )
            for element in video_elements:
                title_element = element.find_element(By.ID, 'video-title')
                title = title_element.text.strip()
                url_element = element.find_element(By.ID, 'video-title-link')
                url = url_element.get_attribute('href')
                videoIdValue = url.split("v=", 1)[1]
                videoId = "https://www.youtube.com/embed/" + videoIdValue
                video_data.append({"title": title, "url": url, "videoId": videoId})
            break
        except StaleElementReferenceException:
            print("Encountered a stale element reference exception, retrying...")
        except Exception as e:
            print("An error occurred:", e)
            break
    
    # Save video data to JSON
    with open('src/content/youtube_video_data.json', 'w') as f:
        json.dump(video_data, f, indent=4)
    
    # Close the WebDriver
    driver.quit()

    return video_data

# URL of the YouTube channel page
channel_url = "https://www.youtube.com/@EverythingWomensFootball/videos"

extracted_data = extract_youtube_data(channel_url)
print(extracted_data)
