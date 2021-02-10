if (!harvesterAPI) { throw new Error('The API has not been loaded? Unable to continue!'); }

(function(win, doc) {
    // Closure used to avoid unnecessarily injecting functions to global scope...
    const container0 = doc.querySelector('#mimir-main-app-ui');
    const eyecandy3d = doc.createElement('div');
    eyecandy3d.className = 'eyecandy3d turning';
    const platter = doc.createElement('div');
    platter.className = 'platter';
    eyecandy3d.appendChild(platter.cloneNode());
    eyecandy3d.appendChild(platter.cloneNode());
    eyecandy3d.appendChild(platter.cloneNode());
    eyecandy3d.appendChild(platter.cloneNode());

    const container1 = doc.createElement('div');
    container1.className = 'current';
    const container2 = doc.createElement('div');
    container2.className = 'leaving';

    container0.append(eyecandy3d);
    container0.append(container1);
    container0.append(container2);

    function advertise(data) {
        const currentContainer = container0.querySelector('div:not(.current):not(.eyecandy3d):not(.platter)');
        const leavingContainer = container0.querySelector('div.current');
        currentContainer.innerHTML = data.join("\n");
        win.requestAnimationFrame(() => {
            currentContainer.querySelectorAll('span').forEach(element => {
                const text = element.innerText || '';
                const wides = text.replace(/[^!Iil1j\.\,\'\"\(\)\[\]\{\}\\\/\|]/, '').length;
                const narrows = text.length - wides;
                element.style['font-size'] = 'calc(calc(calc(75vw / ' + wides + ') + calc(100vw / ' + narrows + ')) / ' + text.length + ')';
            });
        });
        currentContainer.className = 'current';
        leavingContainer.className = 'leaving';
    }

    function onStreamInfo({ detail: eventDetails } = {}) {
        const { url, name, genre, description, test } = (eventDetails || {});
        if (!test) {
            // return; // Stream Info is not shown on screen...
            // /*
            return advertise([
                (name && `<span class="name">${name}</span>`),
                (genre && `<span class="genre">${genre}</span>`),
                (description && `<span class="description">${description}</span>`),
                (url && `<span class="url">${url}</span>`),
            ].filter(Boolean));
            // */
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
