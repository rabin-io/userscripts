// ==UserScript==
// @name         Don't Fuck With Paste
// @namespace    https://gist.github.com/rabin-io/bb5042b794874c52fc318d0f92135bec#file-dont-fuck-with-paste-user-js
// @version      0.30
// @description  This add-on stops websites from blocking copy and paste for password fields and other input fields.
// @author       rabin-io
// @match        https://*.yahav.co.il/*
// @grant        none
// @run-at       document-end
// @updateURL    https://gist.github.com/rabin-io/bb5042b794874c52fc318d0f92135bec/raw/
// @downloadURL  https://gist.github.com/rabin-io/bb5042b794874c52fc318d0f92135bec/raw/
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.bank-yahav.co.il&size=64
// ==/UserScript==

(function() {
    'use strict';

    var allowPaste = function(e){
    e.stopImmediatePropagation();
    return true;
    };
    document.addEventListener('paste', allowPaste, true);

})();
