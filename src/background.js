//Set up background event listener
chrome.runtime.onInstalled.addListener(function () {
    //example event
    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log("The color is green.");
    });
});