// localize the HTML
document.querySelectorAll('[data-message]').forEach(elem => {
    elem.textContent = chrome.i18n.getMessage(elem.dataset.message);
});

document.getElementById('shortcutsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

document.getElementById('clearSettings').addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.contentSettings.javascript) {
        // Clear both regular & incognito session rules
        chrome.contentSettings.javascript.clear({ scope: 'regular' }, () => {
            chrome.contentSettings.javascript.clear({ scope: 'incognito_session_only' }, () => {
                const message = document.getElementById('message');
                message.textContent = chrome.i18n.getMessage('settingsCleared');
                setTimeout(() => message.textContent = '\u00A0', 1000);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({
        refresh: true
    }, (items) => {
        document.getElementById('refresh').checked = items.refresh;
    });
});

document.getElementById('save').addEventListener('click', async () => {
    const refresh = document.getElementById('refresh').checked;
    await chrome.storage.sync.set({
        refresh: refresh
    });

    const message = document.getElementById('message');
    message.textContent = chrome.i18n.getMessage('optionsSaved');
    setTimeout(() => message.textContent = '\u00A0', 1000);
});
