// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

$('#google-button').on('click', function () {
    console.log('google login button clicked')
    // Initialize with your OAuth.io app public key
    OAuth.initialize('YOUR_OAUTH_KEY');
    // Use popup for oauth
    OAuth.popup('google').then(google => {
        console.log('google:', google);
        // Retrieves user data from oauth provider
        // Prompts 'welcome' message with User's email on successful login
        // #me() is a convenient method to retrieve user data without requiring you
        // to know which OAuth provider url to call
        google.me().then(data => {
            console.log('me data:', data);
            alert('Google says your email is:' + data.email + ".\nView browser 'Console Log' for more details");
        });
        // Retrieves user data from OAuth provider by using #get() and
        // OAuth provider url
        google.get('/plus/v1/people/me').then(data => {
            console.log('self data:', data);
        })
    });
})

function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}