
chrome.browserAction.onClicked.addListener(function () {
    console.log('click');
});

chrome.runtime.onMessage.addListener(function (msg) {
    console.log(msg);
    if (!chrome || !chrome.windows)
        return;
    chrome.windows.create(
        {
            url: "http://dictionary.cambridge.org/dictionary/english/" + msg.toLowerCase(),
            // width: 200,
            type: "panel"
        });
});
