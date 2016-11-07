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

            $("input[type=submit]", $form).each((i2, input) => {
                var $input = $(input);
                if ($input.data('classic-to-spa-processing-done'))
                    return;

                input.addEventListener("click", e => {
                    var method = $form.attr('method') || 'get';
                    var url = $form.attr('action') || document.location.href;
                    e.preventDefault();
                    navigate(url, method, $form.serialize());
                });
            });
        });
    }

    var navigate = function (url: string, method: string, data?: string) {
        var nurl = new URI(url);
        nurl.addSearch('is-spa-request', 'true');
        var actualXhr : any = null;
        $.ajax(nurl.href(), {
            xhr: function () {
                actualXhr = jQuery.ajaxSettings.xhr();
                return actualXhr;
            },
            data: data,
            method: method,
            success: (html, status) => {
                var responseURL = actualXhr.responseURL;
                pageContainer.innerHTML = html;
                update();
                var nurl2 = new URI(actualXhr.responseURL);
                nurl2.removeSearch('is-spa-request');
                setMessage("subsequent, asynchronous page load: " + url + " (actually " + nurl2.href() + ")");
                history.pushState({}, '?', nurl2.href()); // FIXME
            },
            error: (xhr) => {
                setHtmlPage(xhr.responseText);
            },
            complete: () => { }
        });
    };

    var loadIfRequired = function () {
        var url = new URI(document.location.href);

        url.addSearch('is-spa-request', 'true');

        // FIXME: redirects

        $.ajax(url.href(), {
            success: (html, status) => {
                setMessage("subsequent, asynchronous page load: " + url);
                pageContainer.innerHTML = html;
                update();
            },
            error: (xhr) => {
                setHtmlPage(xhr.responseText);
            },
            complete: () => { }
        });
    }

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
            loadIfRequired();
        };
        update();
        setMessage("initial, direct page load: " + document.location.href);
    }
}

$(ClassicToSpa.init);