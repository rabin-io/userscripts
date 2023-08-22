// ==UserScript==
// @name         Toggle line wrap in Gmail
// @namespace    https://rabin.io/
// @version      0.3
// @description  Press "w" (hotkey) to toggle linewrap for emails
// @author       rabin.io
// @license      GPLv3
// @downloadURL  https://gist.githubusercontent.com/rabin-io/f81e4267485c79708e38d3216d335cdc/raw/gmail-toggle-wrap.user.js
// @homepageURL  https://blog.rabin.io/quick-tip/add-a-custom-hotkey-in-gmail-with-greasemonkey-tampermonkey
// @match        https://mail.google.com/mail/u/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js#sha256=175101ba35d20ed8f46017ba1144ea39cea574e592db891b32c183b41df80361
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(document).bind('keypress', 'w', toggle_mono);

    function toggle_mono() {

        var i=$('div[role=\"listitem\"].h7');

        if (i.css('white-space') == 'nowrap')
        {
            i.css('white-space', 'normal');
            //            console.log('switching to normal');
            //            console.log($(this));
        }
        else
        {
            i.css('white-space', 'nowrap');
            //            console.log('switching to nowrap');
            //            console.log($(this));
        }
    }
})();
