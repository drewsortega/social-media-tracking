var weekFromNow = Date.now() + 604800000

window.onload = function () {

    chrome.identity.getAuthToken({ interactive: false }, function (token) {
        if (token != undefined) {
            console.log("logged in!");
        }
    });

    document.getElementById('gButton').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {

            if (token != undefined) {
                // Handle login success case.
                console.log("login successful: " + token);
                chrome.identity.getProfileUserInfo((profile) => {
                    var profileRequest = new XMLHttpRequest();
                    profileRequest.open('GET', 'https://www.googleapis.com/userinfo/v2/me');
                    profileRequest.setRequestHeader('Content-length', 0);
                    profileRequest.setRequestHeader('Authorization', `Bearer ${token}`);
                    profileRequest.onload = () => {
                        let userInfo = JSON.parse(profileRequest.responseText);
                        let storeData = {
                            id: userInfo.id,
                            full_name: userInfo.name,
                            given_name: userInfo.given_name,
                            image_url: userInfo.image,
                            token
                        };
                        let storeRequest = new XMLHttpRequest();
                        storeRequest.open('POST', 'http://flip1.engr.oregonstate.edu:35432/auth/login_signup');
                        storeRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        storeRequest.onload = () => {
                            console.log('saved user profile data');
                        }
                        storeRequest.send(JSON.stringify(storeData));
                    };
                    profileRequest.send();
                });
                chrome.browserAction.setPopup({ popup: 'dashboard.html' });
            } else {
                // Handle login failure case.
            }
        })

    })

    document.getElementById('logout').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: false }, function (token) {
            if (token != undefined) {
                chrome.identity.removeCachedAuthToken({ token: token });
                // FIXME: This should probably be handled globally, in background.js, using onSignInChanged().
                chrome.browserAction.setPopup({ popup: '' });
            }
        });
    })

}
