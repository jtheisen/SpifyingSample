/// <reference path="typings/jquery/jquery.d.ts" />
// changed anchors and form buttons function (update)
// the load function (called on initial site loading and on anchor and form button clicks)
var ClassicToSpa;
(function (ClassicToSpa) {
    var pageContainer = document.getElementById('loaded-content');
    var $pageContainer = $(pageContainer);
    var update = function () {
        $("a").each(function (i, element) {
            var $element = $(element);
            if ($element.data('classic-to-spa-processing-done'))
                return;
            element.addEventListener("click", function (e) {
                var url = $element.attr('href');
                if (url && url !== '#') {
                    e.preventDefault();
                    navigate(url, 'get');
                }
            });
            $element.data('classic-to-spa-processing-done', true);
        });
        $("form").each(function (i, form) {
            var $form = $(form);
            if ($form.data('classic-to-spa-processing-done'))
                return;
            var buttonSelector = "input[type=submit], button[type=submit]";
            $(buttonSelector, $form).each(function (i2, button) {
                var $button = $(button);
                if ($button.data('classic-to-spa-processing-done'))
                    return;
                button.addEventListener("click", function (e) {
                    e.preventDefault();
                    var method = $form.attr('method') || 'get';
                    var url = $form.attr('action') || document.location.href;
                    var formDataArray = $form.serializeArray();
                    var name = $button.attr('name');
                    var formData = {};
                    for (var _i = 0, formDataArray_1 = formDataArray; _i < formDataArray_1.length; _i++) {
                        var obj = formDataArray_1[_i];
                        formData[obj.name] = obj.value;
                    }
                    if (name) {
                        var value = $button.attr('value');
                        formData[name] = value;
                    }
                    navigate(url, method, $.param(formData));
                });
                $button.data('classic-to-spa-processing-done', true);
            });
        });
    };
    var navigate = function (url, method, data, isPopState) {
        if (!isPopState)
            history.pushState({}, 'loading', url); // FIXME
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
                    history.replaceState({}, '?', actualXhr.responseURL); // FIXME
            },
            error: function (xhr) {
                setHtmlPage(xhr.responseText);
            },
            complete: function () { }
        });
    };
    function setHtmlPage(html) {
        $pageContainer.empty();
        var root = $('<iframe frameBorder="0" width="100%" height="500px" />')
            .appendTo($pageContainer)
            .contents()
            .find('html')
            .html(html);
    }
    function setMessage(msg) {
        console.info(msg);
    }
    ;
    ClassicToSpa.init = function () {
        onpopstate = function (e) {
            navigate(document.location.href, 'get', null, true);
        };
        update();
        setMessage("initial, direct page load: " + document.location.href);
    };
})(ClassicToSpa || (ClassicToSpa = {}));
$(ClassicToSpa.init);
//# sourceMappingURL=classic-to-spa.js.map