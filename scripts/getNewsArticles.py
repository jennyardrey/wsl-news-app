import logging
from bs4 import BeautifulSoup
import json
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

def init_webdriver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    service = Service('/usr/local/bin/chromedriver')  # Update path if necessary
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def handle_cookie_banner(driver):
    try:
        # Adjust the selector based on the actual cookie banner structure of the website
        accept_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, '.sp_choice_type_11'))
        )
        accept_button.click()
        print("Cookie banner accepted.")
    except (TimeoutException, NoSuchElementException) as e:
        print("No cookie banner found or unable to click accept button.")

def handle_donation_banner(driver):
    try:
        # Adjust the selector based on the actual cookie banner structure of the website
        close_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, '.dcr-146samk'))
        )
        close_button.click()
        print("donation banner accepted.")
    except (TimeoutException, NoSuchElementException) as e:
        print("No donation banner found or unable to click accept button.")

def scrape_news(driver, url):
    driver.get(url)
    handle_cookie_banner(driver)
    handle_donation_banner(driver)

    # Wait for the page to fully load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.fc-slice__item'))
    )

    # Take a screenshot for debugging
    screenshot_path = 'scripts/page_screenshot.png'
    driver.save_screenshot(screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    articles = soup.select('.fc-slice__item')
    print(f"articles: {articles}")

    news_list = []

    for article in articles:
        headline_element = article.select_one('.fc-item__headline')
        headline = headline_element.text.strip() if headline_element else None

        link_element = article.select_one('.fc-item__link')
        link = link_element['href'] if link_element else None

        image_element = article.select_one('.responsive-img')
        image = image_element['src'] if image_element else None

        summary_element = article.select_one('.fc-item__standfirst')
        summary = summary_element.text.strip() if summary_element else None

        news_obj = {
            'headline': headline,
            'link': link,
            'image': image,
            'summary': summary
        }

        print(f"News Object {news_obj}")

        news_list.append(news_obj)

    return news_list, screenshot_path


def save_to_json(news_list, filename):
    try:
        with open(filename, 'w') as file:
            json.dump(news_list, file, indent=4)
        print(f"Successfully saved news data to {filename}")
    except Exception as e:
        print(f"Error occurred while saving news data: {e}")

def main():
    url = 'https://www.theguardian.com/football/womensfootball'
    filename = 'scripts/news_data.json'

    print(f"getting url: {url}")

    driver = init_webdriver()

    # Scrape news data
    news_list = scrape_news(driver, url)

    print(f"news list: {news_list}")

    # Save news data to JSON file
    save_to_json(news_list, filename)
    print(f"The News data saved to {filename}")

    driver.quit()

if __name__ == "__main__":
    main()
