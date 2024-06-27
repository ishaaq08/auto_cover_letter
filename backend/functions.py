# Imports
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv
import docx

# Load environment variables
load_dotenv()

# Extract job description
def extract_job_description(job_link):
    # Define headers to be passed in the requests
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"}

    try:
        # Make a request to the website
        response = requests.get(job_link, headers=headers)

        # Check if the response status code is correct
        if response.status_code != 200:
            raise Exception(f"Error making request: {response.status_code}")

        # Parse the HTML content
        soup = BeautifulSoup(response.text, "lxml")

        # Get the job description
        job_description = soup.find("div", {"class": "body-content"})

        if job_description:
            return job_description.text
        else:
            return "No text was found in the specified tag."

    except Exception as e:
        print(f"Error extracting the job description: {e}")

# ChatGPT
def get_completion(prompt, model="gpt-3.5-turbo", temperature=1):
    client = OpenAI()

    messages = [{"role": "user", "content": prompt}]
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature = temperature
    )
    return response.choices[0].message.content
