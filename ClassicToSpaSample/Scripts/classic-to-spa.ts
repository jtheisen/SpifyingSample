/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/urijs/urijs.d.ts" />

// changed anchors and form buttons function (update)
// the load function (called on initial site loading and on anchor and form button clicks)

namespace ClassicToSpa {

    var pageContainer = document.getElementById('loaded-content');
    var $pageContainer = $(pageContainer);

    /* FIXME
     * 
     * - relative uris in anchors and forms
     * - loading curtain
     *
     */

    var update = function () {
        $("a").each((i, element) => {
            var $element = $(element);
            if ($element.data('classic-to-spa-processing-done'))
                return;
            element.addEventListener("click", e => {
                var url = $element.attr('href');

                if (url && url !== '#') {
                    e.preventDefault();
                    navigate(url, 'get');
                }
            });
            $element.data('classic-to-spa-processing-done', true);
        });

        $("form").each((i, form) => {
            var $form = $(form);
            if ($form.data('classic-to-spa-processing-done'))
                return;

            var buttonSelector = "input[type=submit], button[type=submit]";

            $(buttonSelector, $form).each((i2, button) => {
                var $button = $(button);
                if ($button.data('classic-to-spa-processing-done'))
                    return;

                button.addEventListener("click", e => {
                    e.preventDefault();

                    var method = $form.attr('method') || 'get';
                    var url = $form.attr('action') || document.location.href;

                    var formDataArray = $form.serializeArray();

                    var name = $button.attr('name');

                    var formData: { [name: string]: string; } = {};
                    for (var obj of formDataArray) formData[obj.name] = obj.value;

                    if (name) {
                        var value = $button.attr('value');

                        formData[name] = value;
                    }

                    navigate(url, method, $.param(formData));
                });
                $button.data('classic-to-spa-processing-done', true);
            });
        });
    }

    var navigate = function (url: string, method: string, data?: string, isPopState?: boolean) {
        if (!isPopState)
            history.pushState({}, 'loading', url); // FIXME

        var nurl = new URI(url);
        var actualXhr : any = null;
        $.ajax(nurl.href(), {
            xhr: function () {
                actualXhr = jQuery.ajaxSettings.xhr();
                return actualXhr;
            },
            dataType: 'text',
            data: data,
            method: method,
            success: (html, status) => {
                var responseURL = actualXhr.responseURL;

                var regex = /<!-- BODY BEGIN eb8b19a0-87bc-4c04-bcef-b12f4d22bb7c -->([\s\S]*)<!-- BODY END eb8b19a0-87bc-4c04-bcef-b12f4d22bb7c -->/;

                var match = (html as string).match(regex);

                var content = match[1];

                pageContainer.innerHTML = content;
                update();
                setMessage("subsequent, asynchronous page load: " + url + " (actually " + actualXhr.responseURL + ")");

                if (!isPopState)
                    history.replaceState({}, '?', actualXhr.responseURL); // FIXME
            },
            error: (xhr) => {
                setHtmlPage(xhr.responseText);
            },
            complete: () => { }
        });
    };

    function setHtmlPage(html : string) {
        $pageContainer.empty();
        var root = $('<iframe frameBorder="0" width="100%" height="500px" />')
            .appendTo($pageContainer)
            .contents()
            .find('html')
            .html(html);
    }

    function setMessage(msg: string) {
        console.info(msg);
    };

    export var init = () => {
        onpopstate = e => {
            navigate(document.location.href, 'get', null, true);
        };
        update();
        setMessage("initial, direct page load: " + document.location.href);
    }
}

$(ClassicToSpa.init);