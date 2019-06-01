// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// FIXME: Replace this with the code for the dashboard.

'use strict';

window.onload = function () {

  document.getElementById('logout').addEventListener('click', function () {
    chrome.identity.getAuthToken({interactive: false }, function (token) {
        if (token != undefined) {
            chrome.identity.removeCachedAuthToken({token: token});
            // FIXME: This should probably be handled globally, in background.js, using onSignInChanged().
            chrome.browserAction.setPopup({popup: ''});
            // Close the popup.
            window.close();
        }
    });
  });
}
