let globalTarget;

if (!window.fetch) {
    throw new Error('This browser does not support the fetch-API. Unable to continue :(');
}

function registerEventListeners({ guid = '00000000-0000-0000-0000-000000000000', global, onStreamInfo, onTrackInfo }) {
    if (!global || !global.addEventListener || !global.dispatchEvent) {
        throw new Error('There is no proper global target to register event listeners against?');
    }
    if (typeof globalTarget !== 'undefined') {
        throw new Error('Event listeners should only be registered once?');
    }
    globalTarget = global;
    if (
        (!onStreamInfo || typeof onStreamInfo !== 'function')
        &&
        (!onTrackInfo || typeof onTrackInfo !== 'function')
    ) {
        throw new Error('At least one of [ onStreamInfo, onTrackInfo ] functions are needed for registration.');
    }
    // Register the event listeners and send test events to asserts functionality in unit tests...
    console.debug('Attempting to register event listeners for: "' + [
        onStreamInfo && 'harvester:notification:stream',
        onTrackInfo && 'harvester:notification:track',
    ].filter(Boolean).join('", "') + '". ' + [
        'Note: Listeners will be tested after registering.',
        'N.B.: if You do not receive test event(s) for some of the event listener(s), something is wrong.',
        '(However - if You are not expecting the test events, the app will still continue to function to the best of its abilities ... but You *really* should check that the test events are coming through!)',
    ].filter(Boolean).join(' '));
    if (onStreamInfo) {
        global.addEventListener('harvester:notification:stream', onStreamInfo);
        global.dispatchEvent(new CustomEvent('harvester:notification:stream', { detail: {
            test: true,
            url: 'TheURL',
            name: 'TheName',
            genre: 'TheGenre',
            description: 'TheDescription'
        }}));
    }
    if (onTrackInfo) {
        global.addEventListener('harvester:notification:track', onTrackInfo);
        global.dispatchEvent(new CustomEvent('harvester:notification:track', { detail: {
            test: true,
            artist: 'TheArtist',
            title: 'TheTitle'
        }}));
    }

    // Assuming we were able to register event listeners, we can continue here...
    (function(global) {
        const state = {
            stream: {
                url: undefined,
                name: undefined,
                genre: undefined,
                description: undefined,
            },
            track: {
                artist: undefined,
                title: undefined,
            },
            updating: undefined,
        };

        async function update() {
            if (state.updating) { return; }
            state.updating = true;
            try {
                const streamBefore = JSON.stringify(state.stream);
                const trackBefore = JSON.stringify(state.track);
                const response = await fetch(`/api/${guid}/current`, {method: 'GET', mode: 'cors'});
                const responseData = (await response.json()) || {};
                state.stream = responseData.stream ? responseData.stream : state.stream;
                state.track = responseData.track ? responseData.track : state.track;

                if (streamBefore !== JSON.stringify(state.stream)) {
                    global.dispatchEvent(new CustomEvent('harvester:notification:stream', { detail: state.stream }));
                }
                if (trackBefore !== JSON.stringify(state.track)) {
                    global.dispatchEvent(new CustomEvent('harvester:notification:track', { detail: state.track }));
                }
            } finally {
                state.updating = false;
            }
        }

        // Check every 0.5 seconds...
        global.checkInterval = global.setInterval(update, 500);
        update();
    })(global);
}

// Inject globally accessible object for the API
window.harvesterAPI = { registerEventListeners };
