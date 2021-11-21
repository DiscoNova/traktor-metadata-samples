if (!harvesterAPI) { throw new Error('The API has not been loaded? Unable to continue!'); }

(function(win, doc) {
    // Closure used to avoid unnecessarily injecting functions to global scope...
    const body = doc.getElementsByTagName('body')[0];
    body.className = 'greenscreen'; // This visualization is meant for OBS
    let nextReveal = null;

    const state = {
        rotate3d: {
            p: 500
        }
    };
    let deltaX = 3;
    let deltaY = 5;
    let deltaZ = 7;
    let deltaP = 11;
    let deltaR = 17;

    function animate3d () {
        const currentTrackContainer = doc.getElementById('current-track');
        if (!currentTrackContainer) {
            win.requestAnimationFrame(animate3d);
            return;
        }
        state.rotate3d = {
            ...state.rotate3d,
            x: (((((state.rotate3d || {}).x) >> 0))) + deltaX,
            y: (((((state.rotate3d || {}).y) >> 0))) + deltaY,
            z: (((((state.rotate3d || {}).z) >> 0))) + deltaZ,
            p: ((((state.rotate3d || {}).p) >> 0)) + deltaP,
            r: ((((state.rotate3d || {}).r) >> 0)) + deltaR,
        };
        const x3d = Math.round(state.rotate3d.x);
        const y3d = Math.round(state.rotate3d.y);
        const z3d = Math.round(state.rotate3d.z);
        const r = Math.round(state.rotate3d.r / 30);
        currentTrackContainer.style.transform = `translate(-50%, -50%) rotate3d(${x3d}, ${y3d}, ${z3d}, ${r}deg)`;
        win.requestAnimationFrame(animate3d);
    }

    win.requestAnimationFrame(animate3d);

    function advertiseTrackInfo(artist, title) {
        if (state.artist === artist && state.title === title) { return; } // Nothing has changed; do nothing

        let delay = 0;

        const currentTrack = doc.getElementById('current-track');
        if (currentTrack) {
            console.debug('First we need to fade out the current track ... ', currentTrack.innerHTML);
            delay += 2500;
            currentTrack.classList.add('fadeOut');
        }

        if (nextReveal) {
            win.clearTimeout(nextReveal);
        }
        nextReveal = win.setTimeout(function() {
            if (currentTrack) {
                currentTrack.parentNode.removeChild(currentTrack);
            }

            const div = doc.createElement('div');
            div.id = 'current-track';
            div.className = 'text3d';
            const divArtist = doc.createElement('div');
            divArtist.appendChild(doc.createTextNode(artist));
            const divTitle = doc.createElement('div');
            divTitle.appendChild(doc.createTextNode(title));

            div.appendChild(divArtist);
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
