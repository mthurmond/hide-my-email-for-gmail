//create flag to control whether inbox should be hidden. set value to true and remove initial toggleInbox function call to show inbox by default. set to false and include an initial toggleInbox call to hide inbox by default.
let showMessages = false;

//declare global variables. toggle button needs to be global because it's used in multiple functions. title variable is used in a mutation observer and needs to be tracked over time. 
let inboxToggleButton, titleObserver;

// add style to be able to toggle inbox menu item font-weight
// add new style 
const inboxFontStyle = document.createElement('style');
inboxFontStyle.classList.add('hider__inbox-font-style');

//create selector
let inboxUrl = location.protocol+'//'+location.host+location.pathname+'#inbox';
let inboxUrlString = `'${inboxUrl}'`;
let inboxAnchorElementSelector = `a[href=${inboxUrlString}]`;
let inboxAnchorElement = document.querySelector(inboxAnchorElementSelector);

// add style to DOM
inboxFontStyle.innerHTML = `${inboxAnchorElementSelector} { }`;
document.body.appendChild(inboxFontStyle);

// checks whether the user is viewing their inbox, both with and without a new message box open
function checkForInboxHash() {
    let inboxHashBoolean; 

    if (location.hash === '#inbox' || location.hash === '#inbox?compose=new') { 
        inboxHashBoolean = true;
    } else {
        inboxHashBoolean = false;
    }
    return inboxHashBoolean
}

function handleHashChange() {
    // if user viewing inbox, show button, and show/hide emails and toolbar

    if (checkForInboxHash()) {
        // show button
        inboxToggleButton.style.display = 'flex';

        // if viewing inbox, always bold the inbox menu item
        inboxFontStyle.innerHTML = `${inboxAnchorElementSelector} { font-weight: bold !important; }`;
        
        if (showMessages) {
            // show emails and toolbar 
            document.getElementById(':3').style.visibility = 'visible';
            document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";
        } else {
            // hide emails and toolbar 
            document.getElementById(':3').style.visibility = 'hidden';
            document.querySelector("div#\\:4 [gh='tm']").style.visibility = "hidden";
        }

    } else {
        //if user not viewing inbox, hide button, and show emails and toolbar
        inboxToggleButton.style.display = "none";
        document.getElementById(':3').style.visibility = 'visible';
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";

        // if messages hidden and not viewing inbox, unbold the inbox menu item
        if (!showMessages) {
            inboxFontStyle.innerHTML = `${inboxAnchorElementSelector} { font-weight: normal !important; }`;
        }
    }
}

function addToggleButton() {
    inboxToggleButton = document.createElement('button');
    inboxToggleButton.id = 'hider__hide_inbox';
    inboxToggleButton.classList.add('GN', 'GW');
    inboxToggleButton.innerHTML = 'Show inbox';

    //add listener that calls "toggleMessages" when button clicked, and passes opposite of current "showMessages" boolean value. "showMessages" is set to 'false' initially, so this initially passes 'true'.
    inboxToggleButton.addEventListener('click', function (evt) {
        toggleMessages(!showMessages);
    });

    //store gmail button toolbar in a variable
    const buttonToolbar = document.getElementById(':4');
    buttonToolbar.prepend(inboxToggleButton);

    // hides button if user loads a gmail URL that doesn't have the inbox hash
    if (!checkForInboxHash()) {
        inboxToggleButton.style.display = "none";
    } 

    window.onhashchange = handleHashChange;

}

function swapTitle(areMessagesVisible) {

    if (areMessagesVisible) {
        document.title = 'Gmail';
        //remove the mutation observer
        titleObserver.disconnect();
    } else {
        // wrap in if statement in case user initially loads gmail on non-inbox view
        if (checkForInboxHash()) {
            document.title = 'Inbox hidden';
        }

        //activate the mutation observer
        titleObserver = new MutationObserver(function(mutations) {
            if (!showMessages && document.title != 'Inbox hidden' && checkForInboxHash()) {
                document.title = 'Inbox hidden';
            } 
        });

        titleObserver.observe(
            document.querySelector('title'),
            { characterData: true, childList: true }
        );
    }
}

//called when show/hide button clicked, with current "showMessages" boolean value. clicking the button adjusts the sidebar visibility and button text.  
function toggleMessages(areMessagesVisible) {

    const inboxToggleButtonHtml = document.getElementById('hider__hide_inbox');
    inboxToggleButtonHtml.innerHTML = areMessagesVisible ? 'Hide inbox' : 'Show inbox';
    
    // remove focus from button after it's pressed, since native gmail class "GW" has an unwanted focus state
    inboxToggleButtonHtml.blur();
    
    if (areMessagesVisible) {
        // show emails
        document.getElementById(':3').style.visibility = 'visible';
        // show action buttons
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";

    } else if (!areMessagesVisible && checkForInboxHash()) {
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

    if (areMessagesVisible) {
        //add style
        badgeStyle.innerHTML = ".bsU { display: flex; }";
        document.body.appendChild(badgeStyle);

    } else {
        //remove style
        badgeStyle.innerHTML = ".bsU { display: none !important; }";
        document.body.appendChild(badgeStyle);
    }

    // unbold the inbox menu item if messages are hidden and the user isn't viewing the inbox
    if (!areMessagesVisible && location.hash !== '#inbox') {
        inboxFontStyle.innerHTML = `${inboxAnchorElementSelector} { font-weight: normal !important; }`;
    }

    //swap title each time button pressed
    swapTitle(areMessagesVisible)

    //set showMessages equal to its new, opposite value since areMessagesVisible was set to "!showMessages" in the click event handler. the new value must be stored in this global variable so it persists in the browser's memory, gets attached to the 'window' object, and has the correct updated value next time the button is clicked.
    showMessages = areMessagesVisible;
}

// hide inbox body on initial load to avoid flicker
const checkForInboxBody = setInterval(function () {
    if (document.getElementById(':3')) {
        if (location.hash === '#inbox') {
            document.getElementById(':3').style.visibility = 'hidden';
        }
        clearInterval(checkForInboxBody);
    }
}, 100);

// start gmail hider by adding the button and hiding the inbox
function initiateHider() {
    addToggleButton();
        
    // call this to hide messages by default when slack is first loaded
    toggleMessages(showMessages);
}

// once required elements exist, call the function necessary to load gmail hider
const checkForAllElements = setInterval(function () {
    if (
        // top nav buttons 
        document.querySelector("div#\\:4 [gh='tm']")
        // inbox menu item in left sidebar
        && document.querySelector("div [data-tooltip='Inbox']")
        && document.title.length > 0
    ) {
        clearInterval(checkForAllElements);
        initiateHider();
    }
}, 100);

// reduce inbox flicker when user clicks back to inbox menu item
function addInboxMenuEvent() {
    document.querySelector("div [data-tooltip='Inbox']").addEventListener('click', function (evt) {
        if (!showMessages) {
            document.getElementById(':3').style.visibility = 'hidden';
        }
    });
}

// when window loads, call function that reduces inbox flicker
window.onload = function () {
    setTimeout(addInboxMenuEvent, 3000);
}