# Sample clients for Harvester (a.k.a. "Traktor Metadata Listener")

These are some sample clients in various languages You can use with Disco-Nova's [Harvester v0.0.5](https://www.disconova.com/utu/traktor-metadata/5-beta.zip) *(which is considered "perpetually Beta", if you know what I mean)*.

Some users thought the point of the v0.0.5 upgrade of the Harvester was the silly browser-based visualization built into the server ... nothing could be further from the truth. The actual point instead was to create a simple API for other developers to toy with and create their own implementations around it. 

So... here are some samples for Y'all. Enjoy, expand, go wild. *Peace out!*

## But... first things first

* You need to download [Harvester](https://www.disconova.com/utu/traktor-metadata/5-beta.zip)
* There is no installation; the zip-file contains:
    * 32- and 64- bit versions for OSX
    * An executable file for Windows
* You should start the appropriate version from command line
    * On Mac (OSX) that means you need to fire up Terminal
    * On Windows that means you need to fire up ````cmd.exe```` (I think, I'm very bad with Windows stuff:)
* And... If You got lost on the previous step ... I don't want to be an a**hole, but ... most of these samples probably will not make any sense to you either and You probably should go watch cat videos on Youtube instead.
* Configure Your Traktor to broadcast whatever You're playing to Harvester (by default, the broadcast server address should be ```127.0.0.1``` and port ```8080``` ... Your mileage may vary).

## And then...

At this point You're either watching cat videos on Youtube, possibly cursing the arsehole developer who things that is a better way to spend your time ... or You're still here interested in what you can do with the API.

So... If You are still here, You're **exactly** the kind of tinkerer who might get something out of this repository.

# Samples

* [Shell scripting](shell-script/) on *nix family (Linux, Mac OSX, etc.)
* [Python](python/)
