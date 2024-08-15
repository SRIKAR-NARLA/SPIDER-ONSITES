import requests

from requests.exceptions import RequestException

def check_website(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return f"Website {url} is up."
        else:
            return f"Website {url} returned status code {response.status_code}."
    except RequestException as e:
        return f"Website {url} is down. Error: {e}"
    
urls_to_check = [
    'https://google.com',
    'http://fake.fake',
    'https://en.wikipedia.org/wiki/Steganography'
]

def monitor_websites(urls):
    for url in urls:
        status = check_website(url)
        print(status)

if __name__ == "__main__":
    monitor_websites(urls_to_check)