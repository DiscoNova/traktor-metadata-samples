# client.py

    usage: client.py [-h] [--harvester-host HARVESTER_HOST] [--harvester-port HARVESTER_PORT]
    
    optional arguments:
      -h, --help            show this help message and exit
      --harvester-host HARVESTER_HOST
                            the ip-address where the Harvester API-requests are queried from
      --harvester-port HARVESTER_PORT
                            the port number where the Harvester API-requests are queried from

The client will query data from defined Harvester server endpoint. The default endpoint is `http://127.0.0.1:8080/api/<GUID>/current` ... and the GUID has been set to a predefined "testing account" `00000000-0000-0000-0000-000000000000`, which should not exist in a final build. However, at this point it is the only existing account on the server.

Endpoint is queried every second, and if the response differs from previously received one, details will be written to two files; `current.json` which contains the full JSON-formatted response from the server and `current.txt` which contains a simple string `<ARTIST> - <TITLE>` ... the implementation is simple and should be very easy to modify to meet developers' individual needs.
