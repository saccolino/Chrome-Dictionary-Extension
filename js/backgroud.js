
var cambridge_URL = "http://dictionary.cambridge.org/dictionary/english/";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.more) {
        chrome.windows.create(
            {
                url: cambridge_URL + msg.word,
                type: "panel"
            });
        return false;
    }

    search(msg.word, function (result) {
        sendResponse(result);
    });
    return true;
});

function search(word, callback) {

    //teste:
    // callback(
    //     { "word": "bandwidth", "ukMp3url": "http://dictionary.cambridge.org/media/english/uk_pron/u/ukb/ukb02/ukb02308.mp3", "ukIpa": "ˈbænd.wɪtθ", "usMp3url": "http://dictionary.cambridge.org/media/english/us_pron/u/usb/usb02/usb02308.mp3", "usIpa": "ˈbænd.wɪtθ", "definition": "a measurement of the amount of information that can be sent between computers, through a phone line, etc." }
    // );
    // return;

    $.get(cambridge_URL + word, function (data) {

        if (!data) {
            callback();
            return;
        }
        var result;
        try {
            result = getValues(data);
            if (!result) {
                callback();
                return;
            }
        }
        catch (error) {
            callback();
            return;
        }

        callback(result);
    });

    function getValues(data) {
        var result = $(data);
        word = result.find(".headword:first").text();

        if (!word) {
            callback();
            return;
        }

        var ukMp3url = result.find('span[pron-region="UK"] span')[2].getAttribute('data-src-mp3');
        var usMp3url = result.find('span[pron-region="US"] span')[2].getAttribute('data-src-mp3');

        var ukIap = result.find('span[pron-region=UK] span.ipa:first').html();
        var usIap = result.find('span[pron-region=US] span.ipa:first').html();

        var definition = result.find('p.def-head b:first').text().trim();
        definition = definition.substring(0, definition.length - 1);

        return {
            'word': word,
            'ukMp3url': ukMp3url,
            'ukIpa': ukIap,
            'usMp3url': usMp3url,
            'usIpa': usIap,
            'definition': definition
        };
    }
}
