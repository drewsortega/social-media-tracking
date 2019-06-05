// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// FIXME: Replace this with the code for the dashboard.

'use strict';


// Suppress the dashboard if the user is not logged in.
chrome.identity.getAuthToken({interactive: false }, function (token) {
  if (token == undefined) {
    // chrome.tabs.create({ url: 'options.html' });
    logout(window, token);
  }
});


window.addEventListener('load', function () {

  document.getElementById('logout').addEventListener('click', function () {
    chrome.identity.getAuthToken({interactive: false }, function (token) {
      logout(window, token);
    });
  });

});
