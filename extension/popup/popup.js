const githubURL = 'https://github.com/';

const mattURL = `${githubURL}/mthurmond`;
const slackHiderURL = `${githubURL}/mthurmond/slack-hider`;
const feedbackURL = `${githubURL}/mthurmond/slack-hider/issues`;

const benURL = `${githubURL}/tavva`;
const quietSlackURL = `${githubURL}/tavva/quiet-slack`;

const manageExtensionsURL = 'chrome://extensions/';
const extensionsDetailsURL = `${manageExtensionsURL}?id=ghbbhaemcgjamohgkapgkdinhgdcpgim`;

//open the appropriate new tab when the user clicks each link
document.querySelector('.feedbackLink').addEventListener('click', function() {
    chrome.tabs.create({url: feedbackURL})
});

document.querySelector('.slackHiderLink').addEventListener('click', function() {
    chrome.tabs.create({url: slackHiderURL})
});

document.querySelector('.extensionsDetailsLink').addEventListener('click', function() {
    chrome.tabs.create({url: extensionsDetailsURL})
});

document.querySelector('.manageExtensionsLink').addEventListener('click', function() {
    chrome.tabs.create({url: manageExtensionsURL})
});

document.querySelector('.benLink').addEventListener('click', function() {
    chrome.tabs.create({url: benURL})
});

document.querySelector('.mattLink').addEventListener('click', function() {
    chrome.tabs.create({url: mattURL})
});

document.querySelector('.quietSlackLink').addEventListener('click', function() {
    chrome.tabs.create({url: quietSlackURL})
});