if (!harvesterAPI) { throw new Error('The API has not been loaded? Unable to continue!'); }

(function(win, doc) {
    // Closure used to avoid unnecessarily injecting functions to global scope...
    const body = doc.getElementsByTagName('body')[0];
    body.className = 'greenscreen'; // This visualization is meant for OBS
    let nextReveal = null;

    const state = {};

    function advertiseTrackInfo(artist, title) {
        if (state.artist === artist && state.title === title) { return; } // Nothing has changed; do nothing

        let delay = 0;
        const currentTrack = doc.getElementById('current-track');
        if (currentTrack) {
            console.debug('First we need to fade out the current track ... ', currentTrack.innerHTML);
            delay += 2500;
            currentTrack.className = 'fadeOut';
        }
        if (nextReveal) {
            win.clearTimeout(nextReveal);
        }

        nextReveal = win.setTimeout(function() {
            if (currentTrack) {
                currentTrack.parentNode.removeChild(currentTrack);
            }
            console.debug(`Received artist="${artist}" & title="${title}"`);
            console.debug('Now we need to animate the next track into view');
            const div = doc.createElement('div');
            div.id = 'current-track';

            const divArtist = doc.createElement('div');
            const divTitle = doc.createElement('div');
            divArtist.className = 'artist';
            divTitle.className = 'title';
            divArtist.appendChild(doc.createTextNode(artist));
            divTitle.appendChild(doc.createTextNode(title));

            div.appendChild(divArtist);
            div.appendChild(divTitle);

            body.appendChild(div);

            win.setTimeout(function() {
                div.className = 'fadeIn';
            }, 250);
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
