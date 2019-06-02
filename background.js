// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// get oauth expiration timestamp from local storage


// check if user is logged in
chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: 'options.html' });
});

// FIXME: Why doesn't this event fire? This would be the ideal place to change the state of the app
// to reflect logged-in vs. logged-out status.
chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
  console.log("onSignInChanged() fired!");
  console.log("signed in? " + signed);
  // Use the next line instead of chrome.tabs.create() if we want to use a popup:
  // chrome.browserAction.setPopup({popup: 'dashboard.html'});

  chrome.browserAction.onClicked.addListener(function () {
      chrome.tabs.create({ url: 'popup.html' });
    });
});
