// ==UserScript==
// @name         Ctrl-Shift-C-Should-Copy
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* Intercept and check keydown events for Ctrl+Shift+C */

    document.body.addEventListener('keydown', function(evt){
        if (evt.ctrlKey && evt.shiftKey && evt.key == "C"){
            // Copy the selection to the clipboard
            document.execCommand('copy');
            // Throw away this event and don't do the default stuff
            evt.stopPropagation();
            evt.preventDefault();
        }
    }, false);

    /* Intercept and check keyup events for Ctrl+Shift+C */

    document.body.addEventListener('keyup', function(evt){
        if (evt.ctrlKey && evt.shiftKey && evt.key == "C"){
            // Throw away this event and don't do the default stuff
            evt.stopPropagation();
            evt.preventDefault();
        }
    }, false);
})();
