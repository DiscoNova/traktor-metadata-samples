from requests import get
from time import sleep

# This script attempts to get the current data from the API endpoint ... if it gets something and the data is
# different from "what it was before", the data will get overwritten.

while True:
    response = get('http://127.0.0.1:8080/api/00000000-0000-0000-0000-000000000000/current')
    if response.status_code == 200:
        with open('current.json', 'w+') as file:
            old = file.read()
            if old <> response.content:
                file.write(response.content)
    sleep(1)

    # If the fetch fails (for whatever reason) the script will continue to fire requests at the server
