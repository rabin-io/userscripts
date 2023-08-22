// ==UserScript==
// @name         RT Ajax Delete
// @namespace    https://gist.github.com/rabin-io/733f0298fcd10d9d6d91cf2faf0519e2#file-rt-ajax-delete-user-js
// @version      2018.06.27
// @description  try to take over the world!
// @author       rabin-io
// @match        .*/Search/Results\.html*
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @updateURL    https://gist.github.com/rabin-io/733f0298fcd10d9d6d91cf2faf0519e2/raw/
// ==/UserScript==

(function() {
    'use strict';

    function getUrlParameter(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam)
            {
                return sParameterName[1];
            }
        }
    }

    var url1 = '%27%3Ca%20href%3D%22__WebPath__%2FTicket%2FDisplay.html%3Fid%3D__id__%22%3E__id__%3C%2Fa%3E%2FTITLE%3A%23%27%2C%0A%27%3Ca%20href%3D%22__WebPath__%2FTicket%2FDisplay.html%3Fid%3D__id__%22%3E__Subject__%3C%2Fa%3E%2FTITLE%3ASubject%27%2C%0A%27__QueueName__%27%2C%0A%27__ExtendedStatus__%27%2C%0A%27__CreatedRelative__%27%2C%0A%27%3CA%20HREF%3D%22__WebPath__%2FTicket%2FDisplay.html%3FAction%3DTake%26id%3D__id__%22%3ETake%3C%2Fa%3E%2FTITLE%3A%26nbsp%3B%20%27&Order=DESC|ASC|ASC|ASC&OrderBy=Created&Query=%20Owner%20%3D%20%27Nobody%27%20AND%20%28%20Status%20%3D%20%27new%27%20OR%20Status%20%3D%20%27open%27%29&RowsPerPage=50#';
    var url2 = '%27%20%20%20%3Cb%3E%3Ca%20href%3D%22__WebPath__%2FTicket%2FDisplay.html%3Fid%3D__id__%22%3E__id__%3C%2Fa%3E%3C%2Fb%3E%2FTITLE%3A%23%27%2C%0A%27%3Cb%3E%3Ca%20href%3D%22__WebPath__%2FTicket%2FDisplay.html%3Fid%3D__id__%22%3E__Subject__%3C%2Fa%3E%3C%2Fb%3E%2FTITLE%3ASubject%27%2C%0A%27__Status__%27%2C%0A%27__QueueName__%27%2C%0A%27__OwnerName__%27%2C%0A%27__Priority__%27%2C%0A%27__NEWLINE__%27%2C%0A%27__Created__%27%2C%0A%27%27%2C%0A%27%3Csmall%3E__Requestors__%3C%2Fsmall%3E%27&Order=ASC|ASC|ASC|ASC&OrderBy=id|||&Query=Queue%20%3D%20%27safe%27&RowsPerPage=50&SavedChartSearchId=new&SavedSearchId=new';
    
    var format_url = getUrlParameter('Format').substr(0,6);
    var selector = '';

    //console.log(format_url);

    switch (format_url) {
        case '%27%3C':
            selector = 'tr > td:first-child';
            break;
        case '%27%20':
            selector = 'tr > td:first-child > b';
            break;

        default:
            selector = 'tr > td:first-child > b';
    }

    var delete_link = '/Ticket/Update.html?DefaultStatus=deleted&Status=deleted&SubmitTicket=1&id=';
    var link_prefix = '<span style="float: left;"><a name="ajax_delete" href="#" del_url="';
    var ajax_loader = '<img width="16px" height="16px" src="/static/images/ajax-loader.gif" />' ;

    function stage1() {
        console.log('called to stage1 - Add delete link to each line');
        //jQuery("tr > td:first-child > b").map(function(i, el)
        jQuery(selector).map(function(i, el)
                             {
            var old_data = jQuery( this ).html();
            var ticket_id = jQuery( this ).text().trim();
            jQuery( el ).html( link_prefix + delete_link + ticket_id + '">DELETE</a></span><div>' + old_data + '</div>');
        });
    }
    function stage2() {
        console.log('called to stage2 - set the delete url foreach');
        jQuery("a[name='ajax_delete']").click( function()
                                              {

            //console.log( "Handler for .click() called." );
            var position = jQuery('html').scrollTop();
            var del_uri  = jQuery( this ).attr("del_url");

            var A = jQuery( this );

            console.log(position);

            A.html(ajax_loader);

            jQuery('html').animate({
                scrollTop: position
            }, 850, function() {
                // Animation complete.
            });


            // Assign handlers immediately after making the request,
            // and remember the jqxhr object for this request
            var jqxhr = $.get( del_uri, function() {
                //alert( "success" );

                A.fadeOut('slow', function () {
                    this.remove();
                });
            })
            .done(function() {
                //alert( "second success" );
            })
            .fail(function() {
                alert( "error" );
            })
            .always(function() {
                //alert( "finished" );
            });


        });
    }

    // Create a deferred object
    var dfd = jQuery.Deferred();
    dfd.done(stage1);
    dfd.resolve();
    console.log('pause');
    dfd.done(stage2);
    dfd.resolve();


})();