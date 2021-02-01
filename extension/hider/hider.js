//create flag to control whether messages sidebar should be hidden. set value to true and remove initial toggleMessages function call to show messages by default. set to false and include an initial toggleMessages call to hide messages by default.
let showMessages = false;

//declare global variables. toggle button needs to be global because it's used in multiple functions. title and favicon variables are used in mutation observers and need to be tracked over time. 
let messageToggleButton, titleObserver, faviconObserver;

//store slack's "no new messages" favicon by loading the image from the .crx file using the chrome extension API's ".getURL" method. 
const noMessageFavicon = chrome.extension.getURL('/hider/favicon-no-messages.png');

// add stylesheet to the DOM so the "message hidden" styles appear immediately
const stylesheetUrl = chrome.extension.getURL('hider/hider-main.css');    
const stylesheetElement = document.createElement('link');
stylesheetElement.rel = 'stylesheet';
stylesheetElement.setAttribute('href', stylesheetUrl);
stylesheetElement.setAttribute('id', "hider__main-stylesheet");
document.body.appendChild(stylesheetElement);

//add button to DOM that hides messages
function addToggleButton() {
    messageToggleButton = document.createElement('button');

    messageToggleButton.innerHTML = showMessages ? 'Hide messages' : 'Show messages';

    //add an id from the hider-button.css file and a native slack class 
    messageToggleButton.id = 'hider__message-toggle-button';
    messageToggleButton.classList.add('c-button-unstyled');

    //add listener that calls "toggleMessages" when button clicked, and passes opposite of current "showMessages" boolean value. "showMessages" is set to 'false' initially, so this initially passes 'true'.
    messageToggleButton.addEventListener('click', function (evt) {
        toggleMessages(!showMessages);
    });

    //store messages sidebar in a variable
    const slackChannelSidebar = document.getElementsByClassName('p-channel_sidebar__list')[0];

    // insert the messageToggleButton as a sibling node that's just before the sidebar
    slackChannelSidebar.parentNode.insertBefore(messageToggleButton, slackChannelSidebar);

}

function swapFavicon(showFavicon) {

    if (showFavicon) {

        chrome.storage.sync.get(['faviconValue'], function (result) {
            document.querySelector('link[rel*="icon"]').href = result.faviconValue;
        });

        //disconnect mutation observer when it's not needed
        faviconObserver.disconnect();

    } else {

        // store link to current favicon then replace it with the no msg favicon
        const lastFavicon = document.querySelector('link[rel*="icon"]').href;
        chrome.storage.sync.set({ 'faviconValue': lastFavicon }, function () { });
        document.querySelector('link[rel*="icon"]').href = noMessageFavicon;

        //set mutation observer that swaps the "no message" favicon back in if it's ever changed while messages are hidden. have to observe the "head" element because slack swaps out the full favicon element whenever the favicon needs to be changed. 
        faviconObserver = new MutationObserver(function(mutations) {
            if (!showMessages && document.querySelector('link[rel*="icon"]').href != noMessageFavicon) {
                document.querySelector('link[rel*="icon"]').href = noMessageFavicon;
            } 
        });

        faviconObserver.observe(
            document.querySelector('head'),
            {subtree: true, characterData: true, childList: true, attributes: true}
        );

    }
}

function swapTitle(showDefaultTitle) {

    if (showDefaultTitle) {

        document.title = 'Slack';

        //remove the mutation observer
        titleObserver.disconnect();

    } else {

        document.title = 'Messages hidden';

        //activate the mutation observer
        titleObserver = new MutationObserver(function(mutations) {
            if (!showMessages && document.title != 'Messages hidden') {
                document.title = 'Messages hidden';
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

    messageToggleButton.innerHTML = areMessagesVisible ? 'Hide messages' : 'Show messages';

    // disable the stylesheet if messages are visible, enable it if they're hidden
    if (areMessagesVisible) {
        stylesheetElement.setAttribute('disabled', true);
    } else {
        stylesheetElement.removeAttribute('disabled');
    } 

    //swap favicon each time button pressed
    swapFavicon(areMessagesVisible);

    //swap title each time button pressed
    swapTitle(areMessagesVisible)

    //set showMessages equal to its new, opposite value since areMessagesVisible was set to "!showMessages" in the click event handler. the new value must be stored in this global variable so it persists in the browser's memory, gets attached to the 'window' object, and has the correct updated value next time the button is clicked.
    showMessages = areMessagesVisible;
}

//once the required elements exist, this function initiates the slack hider
function initiateSlackHider() {
    addToggleButton();
    
    //call this to hide messages by default when slack is first loaded
    toggleMessages(showMessages);
}

//continuously check if the required elements exist. once they do, stop checking and call the appropriate function. 
const checkForElements = setInterval(function () {
    if (
        document.getElementsByClassName('p-channel_sidebar__list').length > 0 
        && document.querySelector('link[rel*="icon"]').href.length > 0 
        && document.title.length > 0
    ) {
        clearInterval(checkForElements);
        initiateSlackHider();
    }
}, 100);

// try { 
//     if(x == "")  throw "empty";
//     if(isNaN(x)) throw "not a number";
//     x = Number(x);
//     if(x < 5)  throw "too low";
//     if(x > 10)   throw "too high";
//   }
//   catch(err) {
//     message.innerHTML = "Input is " + err;
//   }

function errorFunction() {
    try {
        const slackChannelSidebar2 = document.getElementsByClassName('p-channel_sidebar__list')[0];

        if (slackChannelSidebar2.innerHTML = "") throw "sidebar element not found";
        if (true) throw "no errors";
    }
    catch(err) {
        console.log(err);
    }
}

setTimeout(errorFunction, 1000);