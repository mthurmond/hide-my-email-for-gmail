//create flag to control whether inbox should be hidden. set value to true and remove initial toggleInbox function call to show inbox by default. set to false and include an initial toggleInbox call to hide inbox by default.
let showMessages = false;

//declare global variables. toggle button needs to be global because it's used in multiple functions. title variable is used in a mutation observer and needs to be tracked over time. 
let inboxToggleButton, titleObserver;

function handleHashChange() {
    // if user viewing inbox, show button, and show/hide emails and toolbar
    if (location.hash === '#inbox') {
        // show button
        inboxToggleButton.style.display = 'flex';
        
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

    // //if user navigates to different hash, don't displaying button
    // window.addEventListener('hashchange', handleHashChange);
    window.onhashchange = handleHashChange;
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

    const inboxToggleButtonHtml = document.getElementById('hider__hide_inbox');
    inboxToggleButtonHtml.innerHTML = areMessagesVisible ? 'Hide inbox' : 'Show inbox';
    
    // remove focus from button after it's pressed, since native gmail class "GW" has an unwanted focus state
    inboxToggleButtonHtml.blur();
    
    if (areMessagesVisible) {
        // show emails
        document.getElementById(':3').style.visibility = 'visible';
        // show action buttons
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "visible";

    } else if (!areMessagesVisible && location.hash === '#inbox') {
        // hide emails
        document.getElementById(':3').style.visibility = 'hidden';
        // hide action buttons
        document.querySelector("div#\\:4 [gh='tm']").style.visibility = "hidden";
        }

    // show/hide inbox message badges
    // remove prior styles
    const styleToRemove = document.getElementsByClassName('hider__badge-style')[0];
    if (styleToRemove) {
        styleToRemove.remove();
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
        // document.getElementById(':4')
        document.querySelector("div#\\:4 [gh='tm']")
        && document.title.length > 0
    ) {
        clearInterval(checkForElements);
        initiateHider();
    }
}, 100);