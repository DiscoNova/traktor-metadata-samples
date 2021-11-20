if (!harvesterAPI) { throw new Error('The API has not been loaded? Unable to continue!'); }

(function(win, doc) {
    // Closure used to avoid unnecessarily injecting functions to global scope...
    function zeroPad(number) {
        const numeric = number >> 0;
        return `${numeric < 10 ? '0' : ''}${numeric}`;
    }

    function formattedDateTime() {
        const now = new Date();
        const date = `${now.getUTCFullYear()}-${zeroPad(now.getUTCMonth())}-${zeroPad(now.getUTCDate())}`;
        const time = `${zeroPad(now.getUTCHours())}:${zeroPad(now.getUTCMinutes())}:${zeroPad(now.getUTCSeconds())}`;
        return `[${date} ${time}]`;
    }

    function advertise(data) {
        const div = doc.createElement('div');
        div.className = 'harvester';
        const time = doc.createElement('span');
        time.innerHTML = formattedDateTime();
        div.appendChild(time);
        for (let nth in data) {
            const temp = doc.createElement('temp');
            temp.innerHTML = data[nth];
            div.appendChild(temp.firstChild);
        }
        const target = doc.getElementById('mimir-main-app-ui');
        if (!target) {
            throw new Error(`Unable to find target for ${JSON.stringify(data)} rendered as ${JSON.stringify(div.innerHTML)}`);
        }
        target.appendChild(div);
    }

    function onStreamInfo({ detail: eventDetails } = {}) {
        const { url, name, genre, description, test } = (eventDetails || {});
        if (!test) {
            // return; // Stream Info is not shown on screen...
            return advertise([
                `<span>STREAM</span>`,
                (name && `<span class="name">${name}</span>`),
                (genre && `<span class="genre">${genre}</span>`),
                (description && `<span class="description">${description}</span>`),
                (url && `<span class="url">${url}</span>`),
            ].filter(Boolean));
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
            return advertise([
                `<span>TRACK</span>`,
                (artist && `<span class="artist">${artist}</span>`),
                (title && `<span class="title">${title}</span>`),
            ].filter(Boolean));
        }
        // NOTE: This branch exists only to assert that the API is able to send proper events.
        if (!artist || !title) {
            throw new Error('TEST FAILURE => track info event missed detail data.');
        }
        console.debug('TEST SUCCESS => It is possible to receive track info events.');
    }
    (function(win) { harvesterAPI.registerEventListeners({ global: win, onStreamInfo, onTrackInfo }); })(win);
})(window, document);
