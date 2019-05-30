window.onload = function () {
    document.getElementById('gButton').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token);
        })
    })
}