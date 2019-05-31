// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// get oauth expiration timestamp from local storage
var expiration;
chrome.storage.local.get(["expires"], function(timestamp) {
  expiration = timestamp.expires;
});

// check if user is logged in
if (Date.now() <= expiration) {  // Oauth token is still valid
  chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: 'popup.html' });
  });
} else {
  chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: 'options.html' });
  });
}
