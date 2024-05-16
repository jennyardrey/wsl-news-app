import logging
from bs4 import BeautifulSoup
import json
import os
import requests
from requests_toolbelt import sessions
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry # type: ignore

def requests_retry_session(
    retries=3,
    backoff_factor=0.3,
    status_forcelist=(500, 502, 504),
    session=None,
):
    session = session or sessions.BaseUrlSession()

    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )

    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def scrape_news(url):
    # Send a GET request to the URL
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }    
    
    # Use requests_retry_session instead of requests.get
    response = requests_retry_session().get(url, headers=headers)

    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find the relevant elements containing the news articles
    articles = soup.select('.fc-slice__item')
    print(f"articles: {articles}")

    # Create a list to store news objects
    news_list = []

    for article in articles:
        # Extract headline
        headline_element = article.select_one('.fc-item__headline')
        headline = headline_element.text.strip() if headline_element else None

            # Extract link
        link_element = article.select_one('.fc-item__link')
        link = link_element['href'] if link_element else None

        # Extract image (if available)
        image_element = article.select_one('.responsive-img')
        image = image_element['src'] if image_element else None

        # Extract summary
        summary_element = article.select_one('.fc-item__standfirst')
        summary = summary_element.text.strip() if summary_element else None

        # Create a news object
        news_obj = {
            'headline': headline,
            'link': link,
            'image': image,
            'summary': summary
        }

        print(f"News Object {news_obj}")

        news_list.append(news_obj)

    return news_list

def save_to_json(news_list, filename):
    try:
        with open(filename, 'w') as file:
            json.dump(news_list, file, indent=4)
        print(f"Successfully saved news data to {filename}")
    except Exception as e:
        print(f"Error occurred while saving news data: {e}")

def main():
    url = 'https://www.theguardian.com/football/womensfootball'
    filename = 'news_data.json'

    print(f"getting url: {url}")

    # Scrape news data
    news_list = scrape_news(url)

    print(f"news list: {news_list}")

    # Save news data to JSON file
    save_to_json(news_list, filename)
    print(f"The News data saved to {filename}")

if __name__ == "__main__":
    main()
