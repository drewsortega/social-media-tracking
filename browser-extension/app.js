// FIXME: Generic login / logout handling should probably be handled globally, in background.js, using onSignInChanged().
function logout(_window, token) {

    if (token != undefined) {
      chrome.identity.removeCachedAuthToken({'token': token});
    }
  
    // Don't open the popup panel any more.
    chrome.browserAction.setPopup({popup: ''});
    // Close this popup. Use an injected window object to allow this function to be unit-tested.
    _window.close();
  }
  