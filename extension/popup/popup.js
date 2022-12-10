const githubURL = 'https://github.com/';

const mattURL = `${githubURL}/mthurmond`;
const gmailInboxHiderURL = `${githubURL}/mthurmond/inbox-hider-for-gmail`;
const feedbackURL = `${githubURL}/mthurmond/inbox-hider-for-gmail/issues`;

const manageExtensionsURL = 'chrome://extensions/';
const extensionsDetailsURL = `${manageExtensionsURL}?id=koobmglbcddgeoopgphanmhjppfaehaa`;

//open the appropriate new tab when the user clicks each link
document.querySelector('.feedbackLink').addEventListener('click', function() {
    chrome.tabs.create({url: feedbackURL})
});

document.querySelector('.gmailInboxHiderLink').addEventListener('click', function() {
    chrome.tabs.create({url: gmailInboxHiderURL})
});

document.querySelector('.extensionsDetailsLink').addEventListener('click', function() {
    chrome.tabs.create({url: extensionsDetailsURL})
});

document.querySelector('.manageExtensionsLink').addEventListener('click', function() {
    chrome.tabs.create({url: manageExtensionsURL})
});

document.querySelector('.mattLink').addEventListener('click', function() {
    chrome.tabs.create({url: mattURL})
});