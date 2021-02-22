// create flag to control whether inbox should be hidden. set value to true and remove initial toggleInbox function call to show inbox by default. set to false and include an initial toggleInbox call to hide inbox by default.
let showInbox = false;

//declare global variables. toggle button needs to be global because it's used in multiple functions. title variable is used in a mutation observer and needs to be tracked over time. 
let inboxToggleButton, titleObserver;

// add style to toggle inbox menu item font-weight
//create selector, get inbox URL and convert it to string 
let inboxMenuSelector = `a[href='${location.protocol + '//' + location.host + location.pathname + '#inbox'}']`;
// add style to DOM
const inboxFontStyle = document.createElement('style');
inboxFontStyle.classList.add('hider__inbox-font-style');
inboxFontStyle.innerHTML = '';
document.body.appendChild(inboxFontStyle);

// check if user is viewing inbox, both with and without a new email window open
function checkForInboxHash() {
    if (location.hash === '#inbox' || location.hash === '#inbox?compose=new') {
        return true;
    } else {
        return false;
    }
}

function handleHashChange() {
    // remove custom inbox menu styling
    inboxFontStyle.innerHTML = '';

    // if user is viewing inbox
    if (checkForInboxHash()) {
        // show button
        inboxToggleButton.style.display = 'flex';

        if (showInbox) {
            // show emails 
            document.getElementById(':3').style.visibility = 'visible';
            // show toolbar
            document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";
        } else {
            // hide emails
            document.getElementById(':3').style.visibility = 'hidden';
            // hide toolbar
            document.querySelector("div#\\:4 [gh='tm']").style.visibility = "hidden";
        }

    // if user isn't viewing inbox
    } else {
        // hide button
        inboxToggleButton.style.display = "none";
        // show emails
        document.getElementById(':3').style.visibility = 'visible';
        // show toolbar
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";

        // if inbox is hidden
        if (!showInbox) {
            // unbold the inbox menu
            inboxFontStyle.innerHTML = `${inboxMenuSelector} { font-weight: normal !important; }`;
        }
    }
}

function addToggleButton() {
    inboxToggleButton = document.createElement('button');
    inboxToggleButton.id = 'hider__hide_inbox';
    inboxToggleButton.classList.add('GN', 'GW');
    inboxToggleButton.innerHTML = 'Show inbox';

    //add listener that calls "toggleInbox" when button clicked, and passes opposite of current "showInbox" boolean value. "showInbox" is set to 'false' initially, so this initially passes 'true'.
    inboxToggleButton.addEventListener('click', function (evt) {
        toggleInbox(!showInbox);
    });

    //store gmail button toolbar in a variable
    const buttonToolbar = document.getElementById(':4');
    buttonToolbar.prepend(inboxToggleButton);

    // hide button if user initially loads a page other than the inbox
    if (!checkForInboxHash()) {
        inboxToggleButton.style.display = "none";
    }

    window.onhashchange = handleHashChange;

}

function swapTitle(isInboxVisible) {

    if (isInboxVisible) {
        // set doc title to stored value or, if null, to "Gmail"
        chrome.storage.sync.get(['titleText'], function (result) {

            // store unread messages. if none, div will not be in dom, so store '0'.
            let unreadEmailCount = document.querySelector('div.bsU') ? document.querySelector('div.bsU').innerHTML : '0';

            if (result.titleText && result.titleText != 'Gmail') {
                // if actual title was stored when messages were hidden, apply it and swap in the latest unread email count  
                document.title = result.titleText.replace(/\(([^)]+)\)/, `(${unreadEmailCount})`);

            } else {
                // if the actual title wasn't stored when messages were hidden, apply a standard title with the latest unread email count
                document.title = `Inbox (${unreadEmailCount}) - Gmail`;
            }

        });

        // remove the mutation observer
        titleObserver.disconnect();

    } else {
        // wrap in if statement in case user initially loads gmail on non-inbox view
        if (checkForInboxHash()) {
            chrome.storage.sync.set({ 'titleText': document.title }, function () { });
            document.title = 'Inbox hidden';
        }

        // activate the mutation observer
        titleObserver = new MutationObserver(function (mutations) {
            if (!showInbox && document.title != 'Inbox hidden' && checkForInboxHash()) {
                document.title = 'Inbox hidden';
            }
        });

        titleObserver.observe(
            document.querySelector('title'),
            { characterData: true, childList: true }
        );
    }
}

// called when show/hide button clicked, with current "showInbox" boolean value. clicking the button adjusts the sidebar visibility and button text.  
function toggleInbox(isInboxVisible) {

    const inboxToggleButton = document.getElementById('hider__hide_inbox');
    inboxToggleButton.innerHTML = isInboxVisible ? 'Hide inbox' : 'Show inbox';

    // remove focus from button after it's pressed, since native gmail class "GW" has an unwanted focus state
    inboxToggleButton.blur();

    if (isInboxVisible) {
        // show emails
        document.getElementById(':3').style.visibility = 'visible';
        // show action buttons
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";

        // if inbox hidden and user isn't viewing inbox
    } else if (!isInboxVisible && checkForInboxHash()) {
        // hide emails
        document.getElementById(':3').style.visibility = 'hidden';
        // hide action buttons
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "hidden";
    }

    // show/hide inbox message badges
    // remove prior styles
    const badgeStyleToRemove = document.getElementsByClassName('hider__badge-style')[0];
    if (badgeStyleToRemove) {
        badgeStyleToRemove.remove();
    }

    // add new style
    const badgeStyle = document.createElement('style');
    badgeStyle.classList.add('hider__badge-style');

    if (isInboxVisible) {
        //add style
        badgeStyle.innerHTML = ".bsU { display: flex; }";
        document.body.appendChild(badgeStyle);

    } else {
        //remove style
        badgeStyle.innerHTML = ".bsU { display: none !important; }";
        document.body.appendChild(badgeStyle);
    }

    // unbold the inbox menu item if messages are hidden and the user isn't viewing the inbox
    if (!isInboxVisible && location.hash !== '#inbox') {
        inboxFontStyle.innerHTML = `${inboxMenuSelector} { font-weight: normal !important; }`;
    }

    // swap title each time button pressed
    swapTitle(isInboxVisible)

    // set showInbox equal to its new, opposite value since isInboxVisible was set to "!showInbox" in the click event handler. the new value must be stored in this global variable so it persists in the browser's memory, gets attached to the 'window' object, and has the correct updated value next time the button is clicked.
    showInbox = isInboxVisible;
}

// hide inbox on initial load to avoid flicker
const checkForInbox = setInterval(function () {
    if (document.getElementById(':3')) {
        if (location.hash === '#inbox') {
            document.getElementById(':3').style.visibility = 'hidden';
        }
        clearInterval(checkForInbox);
    }
}, 100);

// start gmail hider by adding the button and hiding the inbox
function initiateHider() {
    addToggleButton();

    // call this to hide messages by default when slack is first loaded
    toggleInbox(showInbox);
}

// once required elements exist, call the function necessary to load gmail hider
const checkForStartConditions = setInterval(function () {
    if (
        // top nav buttons 
        document.querySelector("div#\\:4 [gh='tm']")
        // inbox menu item in left sidebar
        && document.querySelector("div [data-tooltip='Inbox']")
        && document.title.length > 0
    ) {
        clearInterval(checkForStartConditions);
        initiateHider();
    }
}, 100);

// reduce inbox flicker when user clicks back to inbox menu item
function addInboxMenuEvent() {
    document.querySelector("div [data-tooltip='Inbox']").addEventListener('click', function (evt) {
        if (!showInbox) {
            document.getElementById(':3').style.visibility = 'hidden';
        }
    });
}

// shortly after window loads, call function that reduces inbox flicker
window.onload = function () {
    setTimeout(addInboxMenuEvent, 3000);
}