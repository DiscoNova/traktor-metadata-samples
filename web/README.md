# Samples for browsers

These samples are meant to be viewed in browsers. They can be used as visualization layers in software such as [BandiCam](https://www.bandicam.com/), [OBS (Open Broadcaster)](https://obsproject.com/), or displayed directly in venues' internal TVs/monitor setups, etc.

The samples rely on the API provided by [Harvester](https://www.disconova.com/utu/traktor-metadata/5-beta.zip) for accessing the metadata stream from Traktor. There is also a internal API shared between all of the samples which simplifies the use of the Harvester API by providing a event-ridden approach developers can subscribe to.

While all the samples provided here have been created without using any modern external libraries, this should not be seen as a limitation - quite the opposite; the provided event-ridden API is rather agnostic when it comes to how developers choose to use it. As long as your code can handle callbacks (or receive events - you can well do that part by yourself, too), it doesn't really matter if your code is built using Angular, React, or whatever the "Next Big Thing" might be ... it's got you covered. 

## CORS -considerations

All the samples currently need a simple [proxy](./local-proxy.py) in order to be able to both serve the custom code as well as access Harvester's API. When I last built a version of the Harvester server, I didn't foresee how soon browsers would get rid of wild cross-origin requests, and ... didn't include any of the necessary headers in the server component. Since Harvester is a purely hobby-project for me, in the years since, I haven't found the time to put in the effort to add such feature.

The proxy is a rather simple python-script which serves *everything* from the directory it is started in as well as proxies any queries sent to the `/api/` -endpoint from Harvester's address. 

### Starting the server(s)

Basically you would first need to start Harvester server using a command line terminal following [the instructions](https://www.disconova.com/utu/traktor-metadata/) ... this way you will have Harvester running on your local machine in port 8080. If you followed the instructions, should have access to the default visualization UI in `http://127.0.0.1:8080/` and are able to connect to it using Traktor's broadcasting -functionality. Note that you should *not* attempt to connect to the proxy-server with Traktor, since the proxy doesn't support the IceCast-protocol's proprietary methods (and even if it did, it would only add an unnecessary extra layer of processing which isn't really something we want to do).

Next... using another command line terminal, you then need to start the proxy with `./local-proxy.py` (of course, this assumes that you have Python3 installed and accessible at `/usr/local/bin/python3` - which it normally is ... however Windows users' mileage may vary if they aren't using WSL, i.e. "Windows subsystem for Linux").

By default, the proxy will start and bind itself to `http://127.0.0.1:9090/` and - as said - serve anything from that folder *and* any request for `http://127.0.0.1:9090/api/<whatever>` will be proxied from the Harvester server `http://127.0.0.1:8080/api/<whatever>` ... Note that you should always start the proxy in the folder containing the sample code (because it will literally be serving the whole directory's content and - while there are some safeguards in place, the proxy is in no shape or form is expected to be anywhere near bulletproof).

### Binding proxy to specific host/port

By default, both PROXY_HOST and HARVESTER_HOST are `127.0.0.1`, whereas PROXY_PORT is `9090` and HARVESTER_PORT is `8080`. These defaults have been chosen in regards to the most common use case where Traktor, Harvester and proxy are all running on the same machine.

    usage: local-proxy.py [-h] [--proxy-host PROXY_HOST] [--proxy-port PROXY_PORT] [--harvester-host HARVESTER_HOST] [--harvester-port HARVESTER_PORT]

    optional arguments:
      -h, --help            show this help message and exit
      --proxy-host PROXY_HOST
                            the ip-address the Proxy binds to
      --proxy-port PROXY_PORT
                            the port number the Proxy binds to
      --harvester-host HARVESTER_HOST
                            the ip-address where the Harvester API-requests are proxied from
      --harvester-port HARVESTER_PORT
                            the port number where the Harvester API-requests are proxied from
With the optional arguments, it is possible to bind the proxy to a specific host-IP and/or port, as well as proxying Harvester API-requests from a specific host-IP and/or port. This is mostly useful for the situation where Traktor, Harvester and proxy need to be (or must be) running on different machines - for any number of reasons.

For example, a venue might have a dedicated Harvester server running on, say, `192.168.0.100` and similarly have a dedicated proxy for visualization running on a completely different machine, say, `192.168.0.123` and ... the DJ might be connecting to Harvester from their own laptop running on `192.168.0.200`or something like that. In such case, the localhost (i.e. `127.0.0.1`) bindings between the server and proxy just isn't adequate, and steps need to be taken to make things work.

Similarly, the default port(s) used by Harvester and proxy might already be in use, prompting the need for binding them to different ports.

It is possible to bind both Harvester server and the proxy to `0.0.0.0` (i.e. "all IP-addresses known to this host"), but from a security point of view I would recommend against it. It is always better to know precisely where your services are bound to rather than have "everything bound to everywhere" - modern computers have a bad habit of introducing virtual interfaces that bind to all sorts of unexpected addresses ;)

Also, while it *is* (at least in theory, seeing how the languages seem to handle these rather transparently) possible to bind to IPv6 addresses ... admittedly, I've never tested how well (if at all) IPv6 works.

## Current web-samples

At the moment, there are a few distinct samples:

### [The original "spinning platter"](./original-spinning-disk/)

This is a standalone version of the default browser visualization from Harvester v0.5 Beta ... If you've used Harvester in the past, this is the visualization UI your browser opens when the server is started.

![Screenshot of "The original spinning platter"](./original-spinning-disk/screenshot.png)

Originally, when the latest version of Harvester server was released, I believed that the built-in implementation of a client would be more than enough for developers to reverse engineer the moving parts and come up with their own visualizations using the API. However, since the code was not readily available online (instead, you had to grap the code from the server and see what it held inside) many developers thought this was all that Harvester was meant to be and dismissed the whole idea.

I did eventually put the original code for the visualization available for download in this repository. If for nothing else, just to throw some ideas for developers :)

### [The simple "artist / song" -list](./simple-artist-and-song/)

The next sample was possibly the simplest form of visualization. On-screen readout of tracks in (almost) log format - every time a new track is seen, a new line listing the timestamp, event-type, artist and title gets added to the page.

![Screenshot of "The simple artist / song -list"](./simple-artist-and-song/screenshot.png)

While definitely not visually entertaining, the code was meant to be brief and comprehensive; this is how you receive data and this is a sample of how you can peruse it.

### [The OBS "artist / song" -overlay](./sample-artist-and-song/)

Overlay visualizer for OBS (green background for chroma key) ... artist/track title scroll in/out when track changes.

![Screenshot of "The OBS artist / song -overlay"](./sample-artist-and-song/screenshot.png)

A minor modification of the simple artist/song -list visualizer. Main takeaway in the code is that it is rather easy to fade in/out the next/previous track. Also meant to demonstrate that the visualization can be created in such a fashion that it can be chroma-keyed (greenscreened) for use in streaming video production.

### [The waving flag "artist / song" background-visualizer](./waving-flag/)

Initial attempt to get something kinda "fancy" out of the visualization. This could be used as a video background or something like that. Initial visualization proof of concept provided by Yusuke Nakaya.

![Screenshot of "The waving flag artist / song background-visualizer"](./waving-flag/screenshot.png)

There are still a few issues with the visualization code; mainly the fact that scaling the text based on the actual length of the artist- / title-texts hasn't been implemented as of yet (though, it shouldn't be too difficult to achieve). Also ... the visualization is currently rather "heavy" for the browser to render (but still definitely within the browser's capabilities even without any optimizations) at the moment.
