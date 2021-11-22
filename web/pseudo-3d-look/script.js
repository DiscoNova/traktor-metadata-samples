if (!harvesterAPI) { throw new Error('The API has not been loaded? Unable to continue!'); }

(function(win, doc) {
    // Closure used to avoid unnecessarily injecting functions to global scope...
    const body = doc.getElementsByTagName('body')[0];
    body.className = 'greenscreen'; // This visualization is meant for OBS

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

        const currentTrack = doc.getElementById('current-track');
        if (currentTrack) {
            delay += 2500;
            currentTrack.classList.add('fadeOut');
        }

        if (state.nextReveal) {
            win.clearTimeout(state.nextReveal);
        }

        state.nextReveal = win.setTimeout(function() {
            if (currentTrack) {
                currentTrack.parentNode.removeChild(currentTrack);
            }

            const div = doc.createElement('div');
            div.id = 'current-track';
            div.className = 'text3d';
            const divArtist = doc.createElement('div');
            divArtist.appendChild(doc.createTextNode(artist));
            div.appendChild(divArtist);
            const divTitle = doc.createElement('div');
            divTitle.appendChild(doc.createTextNode(title));
            div.appendChild(divTitle);
            body.appendChild(div);
        }, delay);
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
