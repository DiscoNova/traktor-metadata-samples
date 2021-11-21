if (!harvesterAPI) { throw new Error('The API has not been loaded? Unable to continue!'); }

(function(win, doc) {
    // Closure used to avoid unnecessarily injecting functions to global scope...
    const body = doc.getElementsByTagName('body')[0];

    const state = {
        artist: '',
        title: '',
        nextReveal: null
    };

    function advertiseTrackInfo(artist, title) {
        if (state.artist === artist && state.title === title) { return; } // Nothing has changed; do nothing

        state.artist = artist;
        state.title = title;

        let delay = 0;

        const currentTrack = doc.querySelectorAll('.current-track');
        if (currentTrack) {
            delay += 500;
            currentTrack.forEach(function (trackContainer) {
                trackContainer.classList.add('fadeOut');
            });
        }
        if (state.nextReveal) {
            win.clearTimeout(state.nextReveal);
        }
        const upcomingTrack = doc.createElement('div');
        upcomingTrack.classList.add('current-track');
        upcomingTrack.classList.add('fadeIn');
        const upperTextLayer = doc.createElement('div');
        upperTextLayer.className = 'text-layer';
        const lowerTextLayer = doc.createElement('div');
        lowerTextLayer.className = 'text-layer';
        for (let i = 0; i < 26; i++) {
            const upperTextLine = doc.createElement('div');
            upperTextLine.className = 'upper-line';
            upperTextLine.appendChild(doc.createTextNode(state.artist));
            upperTextLayer.appendChild(upperTextLine);
            const lowerTextLine = doc.createElement('div');
            lowerTextLine.className = 'lower-line';
            lowerTextLine.appendChild(doc.createTextNode(state.title));
            lowerTextLayer.appendChild(lowerTextLine);
        }
        upcomingTrack.appendChild(upperTextLayer);
        upcomingTrack.appendChild(lowerTextLayer);
        body.appendChild(upcomingTrack);

        state.nextReveal = win.setTimeout(function() {
            upcomingTrack.classList.remove('fadeIn');
        }, delay);
        if (currentTrack) {
            win.setTimeout(function() {
                currentTrack.forEach(function(trackContainer) {
                    trackContainer.parentNode.removeChild(trackContainer);
                });
            }, 1000);
        }
    }

    function onStreamInfo({ detail: eventDetails } = {}) {
        const { url, name, genre, description, test } = (eventDetails || {});
        if (!test) {
            return; // Stream Info is not shown on screen...
        }
        // NOTE: This branch exists only to assert that the API is able to send proper events.
        if (!url || !name || !genre || !description) {
            throw new Error('TEST FAILURE => stream info event missed detail data.');
        }
        console.debug('TEST SUCCESS => It is possible to receive stream info events.');
    }
    function onTrackInfo({ detail: eventDetails } = {}) {
        const { artist, title, test } = (eventDetails || {});
        if (!test) {
            return advertiseTrackInfo(artist, title);
        }
        // NOTE: This branch exists only to assert that the API is able to send proper events.
        if (!artist || !title) {
            throw new Error('TEST FAILURE => track info event missed detail data.');
        }
        console.debug('TEST SUCCESS => It is possible to receive track info events.');
    }
    (function(win) { harvesterAPI.registerEventListeners({ global: win, onStreamInfo, onTrackInfo }); })(win);
})(window, document);
