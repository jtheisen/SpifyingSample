/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/js-cookie/js-cookie.d.ts" />
var ClassicToSpaShim;
(function (ClassicToSpaShim) {
    var pageContainer;
    var $pageContainer;
    var useClassicMode = function () {
        return !!Cookies.get('use-classic-mode');
    };
    ClassicToSpaShim.setClassicMode = function (classicModeEnabled) {
        if (classicModeEnabled)
            Cookies.set('use-classic-mode', 'true');
        else
            Cookies.remove('use-classic-mode');
    };
    var update = function () {
        $("a", pageContainer).each(function (i, element) {
            var $element = $(element);
            if ($element.data('classic-to-spa-processing-done'))
                return;
            element.addEventListener("click", function (e) {
                if (useClassicMode())
                    return;
                var url = $element.attr('href');
                if (url && url !== '#') {
                    e.preventDefault();
                    navigate(url, 'get');
                }
            });
            $element.data('classic-to-spa-processing-done', true);
        });
        $("form", pageContainer).each(function (i, form) {
            var $form = $(form);
            if ($form.data('classic-to-spa-processing-done'))
                return;
            var buttonSelector = "input[type=submit], button[type=submit]";
            $(buttonSelector, $form).each(function (i2, button) {
                var $button = $(button);
                if ($button.data('classic-to-spa-processing-done'))
                    return;
                button.addEventListener("click", function (e) {
                    if (useClassicMode())
                        return;
                    e.preventDefault();
                    var method = $form.attr('method') || 'get';
                    var url = $form.attr('action') || document.location.href;
                    var formDataArray = $form.serializeArray();
                    var name = $button.attr('name');
                    if (name) {
                        var value = $button.attr('value');
                        formDataArray.push({ name: name, value: value });
                    }
                    navigate(url, method, $.param(formDataArray));
                });
                $button.data('classic-to-spa-processing-done', true);
            });
        });
    };
    var navigate = function (relativeUrl, method, data, isPopState) {
        var url = new URI(relativeUrl)
            .absoluteTo(document.location.href)
            .href();
        if (!isPopState)
            history.pushState({}, null, url);
        var actualXhr = null;
        $.ajax(url, {
            xhr: function () {
                actualXhr = jQuery.ajaxSettings.xhr();
                return actualXhr;
            },
            dataType: 'text',
            data: data,
            method: method,
            success: function (html, status) {
                var responseURL = actualXhr.responseURL;
                var regex = /<!-- BODY BEGIN eb8b19a0-87bc-4c04-bcef-b12f4d22bb7c -->([\s\S]*)<!-- BODY END eb8b19a0-87bc-4c04-bcef-b12f4d22bb7c -->/;
                var match = html.match(regex);
                var content = match[1];
                pageContainer.innerHTML = content;
                update();
                setMessage("subsequent, asynchronous page load: " + url + " (actually " + actualXhr.responseURL + ")");
                if (!isPopState)
                    history.replaceState({}, null, actualXhr.responseURL);
            },
            error: function (xhr) {
                setHtmlPage(xhr.responseText);
            },
            complete: function () { }
        });
    };
    function setHtmlPage(html) {
        $pageContainer.empty();
        $('<div class="iframe-wrapper"><iframe /></div>')
            .appendTo($pageContainer)
            .find('iframe')
            .contents()
            .find('html')
            .html(html);
    }
    function setMessage(msg) {
        console.info(msg);
    }
    ;
    ClassicToSpaShim.init = function () {
        pageContainer = document.getElementById('load-content');
        if (!pageContainer)
            console.error('Could not find load-content element.');
        $pageContainer = $(pageContainer);
        onpopstate = function (e) {
            navigate(document.location.href, 'get', null, true);
        };
        update();
        setMessage("initial, direct page load: " + document.location.href);
    };
})(ClassicToSpaShim || (ClassicToSpaShim = {}));
$(ClassicToSpaShim.init);
//# sourceMappingURL=classic-to-spa.js.map