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
* [Python](python/) ... there's also another version of the Python-client on branch ```python-with-json-to-txt```, however the reason that hasn't been merged to the ```master```-branch is that the code doesn't seem to handle non-ASCII characters in track-/artist-names properly at this time. I'm fairly certain this is simply because I'm not casting the data properly, but since my experience with Python is limited, I haven't spent too much time looking into that. PRs are welcome.

# Common gotchas

There are a few things that often cause problems for beginners;

## Harvester issues

### Server

* Harvester-server executables are command line applications. While they can be executed by double-clicking on the executable on supported platforms (Win32 / OSX both 32bit/64bit) ... the recommended way to start them is to:
    * manually start a Terminal client;
        * on Windows: shortcut ```Windows-key + R``` and execute ```CMD.exe``` or
        * on OS X: shortcut ```CMD-key + SPACE``` and execute ```terminal.app```
    * within the Terminal client, navigate to the Harvester-server folder and
    * start the server executable for the platform (regardless of system architecture)
        * ```metadata-win32.exe``` on Windows
        * ```metadata-osx-universal``` on OS X

### Traktor connectivity

* You need to have Traktor's Preferences under the "Broadcasting"-view set up for the Harvester-server:
    * The minimum settings necessary are the "Address" and "Port" (defaults "127.0.0.1" and "8080", assuming the Harvester-server is running on the local machine with default settings). The current versions of Harvester expect "Mount Path" and "Password" to be empty (these might be implemented in future versions for multi-user Harvester setup, but for the time being, both of these are unnecessary).
    * For "Format", You can choose any of the available options; at the moment Harvester is not using the audio data at all. Note however that the various options do cause a slight overhead on CPU-usage ... usually, though - no matter which format You choose, should be negligible.
* You connect to the Harvester-server using Traktor's "Audio Recorder". Once the settings above have been set up and the server is running, connecting to Harvester-server should only require You to click on the "Broadcast"-button.
    * If/when the connection is successful, the button lights up solid cyan.
    * If the connection fails, the button will be blinking cyan/gray.
    * If the connection fails while the Harvester-server is running, the Terminal window running the server may have some more information regarding the connectivity problem. Also, the logfile ```metadata.log``` may contain extra information. Usually connection failure is due to invalid address and/or port setting in Traktor preferences.

## Metadata issues

* Traktor only sends the metadata (i.e. artist-/track-names) into the broadcast stream when the track has been "playing" for ~10 seconds. The track is considered "playing" if/when track's volume is "not zero" ... both the track volume fader and, when applicable, crossfader need to be in proper ... however, unlike some users have been reporting, the track **does not need to be assigned "tempo master"**. This can sometimes lead to situations where the track metadata gets sent *before* the DJ intends. Also...
* Traktor will only send the metadata into the broadcast stream once. This means that when:
    1. You play Track A for more than 10s, Traktor will send metadata for Track A to Harvester
    2. You overlay Track B's vocals (for example) on top of Track A for more than 10s, Traktor will send metadata for Track B to Harvester
    3. You get back to playing Track A only and eventually mix over to Track B ... you won't get Track A or Track B metadata sent "again" during this mix.
* Most common issue with metadata is that Traktor doesn't **seem** to be sending it into the broadcast stream always - or seems to be sending nonsensical metadata which is not picked up by the Harvester. This is usually caused by not having proper metadata in the track; the metadata Traktor does send is the same you can see and edit within Traktor by selecting the track, right-clicking and choosing "Edit";
    * e.g.
        * for MP3s, this is generally either the ID3v2.x.x tag physically stored in the beginning of the track (or, if one is not present, the ID3v1 tag physically stored in the end of the track). Most tracks published since mid-1990s already come with ID3v2.x.x tags and Traktor converts ID3v1 tags to ID3v2.x.x whenever the data is modified
        * for MP4s, the metadata is stored in MPEG4-container metadata atoms following the iTunes metadata-style
        * for FLACs, WAVs, and OGGs the metadata is stored in the container formats' own metadata format's private fields
    * Traktor does not seem to support mid-stream metadata within the container (which most above mentioned formats support) for a single file; only single set of metadata.
