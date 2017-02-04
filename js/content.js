(function () {

    $(document).ready(function () {
        var body = $('body');
        $.get(chrome.extension.getURL('/content.html'), function (data) {
            body.append(data);
            body[0].addEventListener("mouseup", onMouseUp);

            document.getElementById("dx-popup-audio-icon-uk")
                .addEventListener('mouseover', onAudioMouseUp);
            document.getElementById("dx-popup-audio-icon-us")
                .addEventListener('mouseover', onAudioMouseUp);

            document.getElementById("dx-popup-more")
                .addEventListener('click', onMore);
        });
    });

    function onMouseUp() {
        hide();
        var selection = window.getSelection();
        if (selection.isCollapsed) return;

        var rect = selection.getRangeAt(0).getBoundingClientRect();
        var strSelected = selection.toString().trim().toLowerCase();

        chrome.runtime.sendMessage({ 'word': strSelected }, function (response) {
            if (!response)
                return;
            show(rect, response);
        });

    }

    function onAudioMouseUp(e) {
        var sound = e.target.getAttribute('data-sound')
        new Audio(sound).play();
    }

    function onMore(e) {
        var word = e.target.parentElement.getAttribute('data-word');
        chrome.runtime.sendMessage({ 'word': word, 'more': true });
    }

    function fill(result) {
        var word = document.getElementById("dx-popup-word");
        word.innerText = result.word;
        var definition = document.getElementById("dx-popup-meaning");
        definition.innerText = result.definition;

        document.getElementById("dx-popup-audio-icon-uk").setAttribute('data-sound', result.ukMp3url);
        document.getElementById("dx-popup-uk-iap").innerHTML = result.ukIpa;
        document.getElementById("dx-popup-audio-icon-us").setAttribute('data-sound', result.usMp3url);
        document.getElementById("dx-popup-us-iap").innerHTML = result.usIpa;

         document.getElementById("dx-popup-more").setAttribute('data-word', result.word);
    }

    function show(rect, result) {
        fill(result);

        var popup = document.getElementById("dx-popup");
        var showAfter = true;
        var topMargin = 7;
        var scrollTop = $(window).scrollTop();
        var top = scrollTop + rect.top - popup.clientHeight - topMargin - 2;

        if (top <= 5) {
            showAfter = false;
            top = rect.bottom + topMargin;
        }

        var scrollLeft = $(window).scrollLeft() ;
        var left = scrollLeft + ((rect.left + rect.right) / 2) - popup.clientWidth / 2;
        if (left <= 5) {
            left = 5;
            showAfter = undefined;
        }

        popup.style.top = top + "px";
        popup.style.left = left + "px";

        popup.classList.add("show");

        if (showAfter === undefined)
            return; //don't show the arrow, todo: check how to move the arrow, probably I have to modify to div and remove ::after and ::before
        else if (showAfter)
            popup.classList.add("showAfter");
        else
            popup.classList.add("showBefore");
    }

    function hide() {
        var popup = document.getElementById("dx-popup");
        popup.classList.remove("show");
        popup.classList.remove("showAfter");
        popup.classList.remove("showBefore");
    }
})();