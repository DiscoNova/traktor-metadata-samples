from requests import get
from time import sleep

while True:
    response = get('http://127.0.0.1:8080/api/00000000-0000-0000-0000-000000000000/current')
    if response.status_code == 200:
        with open('current.json', 'w+') as file:
            old = file.read()
            if old <> response.content:
                file.write(response.content)
    sleep(1)
