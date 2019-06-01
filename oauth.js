var weekFromNow = Date.now() + 604800000

window.onload = function () {

    chrome.identity.getAuthToken({interactive: false }, function (token) {
        if (token != undefined) {
            console.log("logged in!");
        }
    });

    document.getElementById('gButton').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {

            if (token != undefined) {
                // Handle login success case.
                console.log("login successful: " + token);
                chrome.browserAction.setPopup({popup: 'dashboard.html'});
            } else {
                // Handle login failure case.
            }
        })

    })

    document.getElementById('logout').addEventListener('click', function () {
        chrome.identity.getAuthToken({interactive: false }, function (token) {
            if (token != undefined) {
                chrome.identity.removeCachedAuthToken({token: token});
                // FIXME: This should probably be handled globally, in background.js, using onSignInChanged().
                chrome.browserAction.setPopup({popup: ''});
            }
        });
    })

}
