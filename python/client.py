#!/usr/local/bin/python3

from urllib.request import urlopen
from argparse import ArgumentParser
from time import sleep
import json

argParser = ArgumentParser()
argParser.add_argument(
    "--harvester-host",
    type    = str,
    default = "127.0.0.1",
    help    = "the ip-address where the Harvester API-requests are queried from"
    )
argParser.add_argument(
    "--harvester-port",
    type    = int,
    default = 8080,
    help    = "the port number where the Harvester API-requests are queried from"
    )
args = argParser.parse_args()

HARVESTER_HOST = args.harvester_host
HARVESTER_PORT = args.harvester_port
HARVESTER_HOSTPORT = HARVESTER_HOST + ':' + str(HARVESTER_PORT)
HARVESTER_GUID = '00000000-0000-0000-0000-000000000000'; # Only for testing...

def main():
    # This script attempts to get the current data from the API endpoint ... if it gets something and the data is
    # different from "what it was before", the data will get overwritten.
    #
    # Current "raw" JSON response is stored in "current.json", the current track in "current.txt" and previously
    # played tracks (minus the current one) in "history.log"

    while True:
        response = urlopen("http://%s/api/%s/current" % (HARVESTER_HOSTPORT, HARVESTER_GUID))
        if (response.getcode() == 200):
            data = json.loads(response.read())
            with open('current.json', 'w+') as file:
                old = file.read()
                if (old != str(data)):
                    file.write(str(data))
                    if ('track' in data):
                        track = data.get('track')
                        text = open('current.txt', 'w+')
                        if (('artist' in track) and ('title' in track)):
                            info = str(str(track.get('artist')) + ' - ' + str(track.get('title')))
                            text.write(info)
        sleep(1)

        # If the fetch fails (for whatever reason) the script will continue to fire requests at the server

if __name__ == "__main__":
    main()
