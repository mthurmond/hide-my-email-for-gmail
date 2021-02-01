// add stylesheet to the DOM so the "inbox hidden" styles appear immediately
const stylesheetUrl = chrome.extension.getURL('hider/hider-main.css');    
const stylesheetElement = document.createElement('link');
stylesheetElement.rel = 'stylesheet';
stylesheetElement.setAttribute('href', stylesheetUrl);
stylesheetElement.setAttribute('id', "hider__main-stylesheet");
document.body.appendChild(stylesheetElement);

//create flag to control whether inbox should be hidden. set value to true and remove initial toggleInbox function call to show inbox by default. set to false and include an initial toggleInbox call to hide inbox by default.
let showMessages = false;

//declare global variables. toggle button needs to be global because it's used in multiple functions. title variable is used in a mutation observer and needs to be tracked over time. 
let inboxToggleButton, titleObserver;

function addToggleButton() {
    inboxToggleButton = document.createElement('div');
    inboxToggleButton.id = 'hider__hide_inbox';
    inboxToggleButton.classList.add('G-Ni', 'J-J5-Ji');
    inboxToggleButton.innerHTML = '<div class="T-I J-J5-Ji nu T-I-ax7 L3 T-I-Zf-aw2" act="20" role="button" tabindex="0" style="user-select: none;" data-tooltip="Toggle inbox"><div class="hider__button">Show inbox</div></div>';

    //add listener that calls "toggleMessages" when button clicked, and passes opposite of current "showMessages" boolean value. "showMessages" is set to 'false' initially, so this initially passes 'true'.
    inboxToggleButton.addEventListener('click', function (evt) {
        toggleMessages(!showMessages);
    });

    //store gmail button toolbar in a variable
    const buttonToolbar = document.getElementsByClassName('G-tF')[0];
    buttonToolbar.appendChild(inboxToggleButton);

}

function swapTitle(showDefaultTitle) {

    if (showDefaultTitle) {
        document.title = 'Gmail';
        //remove the mutation observer
        titleObserver.disconnect();
    } else {
        document.title = 'Inbox hidden';
        //activate the mutation observer
        titleObserver = new MutationObserver(function(mutations) {
            if (!showMessages && document.title != 'Inbox hidden') {
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

    inboxToggleButton.innerHTML = areMessagesVisible ? 'Hide inbox' : 'Show inbox';

    // disable the stylesheet if messages are visible, enable it if they're hidden
    if (areMessagesVisible) {
        stylesheetElement.setAttribute('disabled', true);
    } else {
        stylesheetElement.removeAttribute('disabled');
    } 

    //swap title each time button pressed
    swapTitle(areMessagesVisible)

    //set showMessages equal to its new, opposite value since areMessagesVisible was set to "!showMessages" in the click event handler. the new value must be stored in this global variable so it persists in the browser's memory, gets attached to the 'window' object, and has the correct updated value next time the button is clicked.
    showMessages = areMessagesVisible;
}

//once the required elements exist, this function initiates the slack hider
function initiateHider() {
    addToggleButton();
    
    // call this to hide messages by default when slack is first loaded
    toggleMessages(showMessages);
}

//continuously check if the required elements exist. once they do, stop checking and call the appropriate function. 
const checkForElements = setInterval(function () {
    if (
        document.getElementsByClassName('G-tF').length > 0
        && document.querySelector('link[rel*="icon"]').href.length > 0 
        && document.title.length > 0
    ) {
        clearInterval(checkForElements);
        initiateHider();
    }
}, 100);