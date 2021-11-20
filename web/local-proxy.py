#!/usr/local/bin/python3

from http.server import SimpleHTTPRequestHandler
from socketserver import  ForkingTCPServer
from urllib.request import urlopen
from argparse import ArgumentParser

argParser = ArgumentParser()
argParser.add_argument(
    "--proxy-host",
    type    = str,
    default = "127.0.0.1",
    help    = "the ip-address the Proxy binds to"
    )
argParser.add_argument(
    "--proxy-port",
    type    = int,
    default = 9090,
    help    = "the port number the Proxy binds to"
    )
argParser.add_argument(
    "--harvester-host",
    type    = str,
    default = "127.0.0.1",
    help    = "the ip-address where the Harvester API-requests are proxied from"
    )
argParser.add_argument(
    "--harvester-port",
    type    = int,
    default = 8080,
    help    = "the port number where the Harvester API-requests are proxied from"
    )
args = argParser.parse_args()

PROXY_HOST = args.proxy_host
PROXY_PORT = args.proxy_port
HARVESTER_HOST = args.harvester_host
HARVESTER_PORT = args.harvester_port

class LocalProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/"):
            proxyURL = "http://" + str(HARVESTER_HOST) + ":" + str(HARVESTER_PORT) + str(self.path)
            proxiedData = urlopen(proxyURL)

            self.send_response(200)
            for key, value in proxiedData.info().items():
                if key != "Date" and key != "Server":
                    self.send_header(key, value)
                else:
                    self.send_header("X-Original-%s" % key, value)
            self.end_headers()
            self.copyfile(proxiedData, self.wfile)
        else:
            if self.path == "/":
                self.path = "/index.html"
            return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == "__main__":
    with ForkingTCPServer((PROXY_HOST, PROXY_PORT), LocalProxyHandler) as httpd:
        print("Local proxying server started at http://" + str(PROXY_HOST) + ":" + str(PROXY_PORT) + "/")
        print("Proxying (the API) requests from http://" + str(HARVESTER_HOST) + ":" + str(HARVESTER_PORT) + "/")
        httpd.serve_forever()
