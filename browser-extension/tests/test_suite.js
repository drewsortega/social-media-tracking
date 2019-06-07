describe("Google OAuth", function() {

  it("logs out the user when the Logout button is clicked on the dashboard", function() {

    spyOn(chrome.browserAction, "setPopup");
    fakeToken = "faketoken-faketoken-faketoken";
    spyOn(chrome.identity, "removeCachedAuthToken");

    // I needed to inject the window object to the logout() function to make it testable. Not sure this increases readability.
    // Source: https://stackoverflow.com/questions/8919370/jasmine-mock-window-object
    fakeWindow = jasmine.createSpyObj("window", ["close"]);

    logout(fakeWindow, fakeToken);

    expect(chrome.browserAction.setPopup).toHaveBeenCalledWith({popup: ""});
    expect(chrome.identity.removeCachedAuthToken).toHaveBeenCalledWith({token: fakeToken});
    expect(fakeWindow.close.calls.count()).toEqual(1);

  });

});
