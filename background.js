// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// get oauth expiration timestamp from local storage


// check if user is logged in
chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.create({ url: 'options.html' });
});

chrome.identity.onSignInChanged.addListener(function () {
  chrome.browserAction.onClicked.addListener(function () {
      chrome.tabs.create({ url: 'popup.html' });
    })
})
